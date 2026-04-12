from __future__ import annotations

import json
from pathlib import Path
from typing import Dict, List, Sequence, Tuple

import joblib
import mne
import numpy as np
import pandas as pd
from scipy.signal import welch
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.model_selection import LeaveOneGroupOut
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType


# ============================================================
# Config
# ============================================================

WINDOW_SEC = 5.0
LOWCUT = 0.5
HIGHCUT = 30.0
TARGET_LABELS = ["meditation", "mind_wandering"]

# OpenNeuro ds001787 uses probe events during meditation. This script anchors each
# sample on a probe onset (trial_type=stimulus, value=128), then uses the 5-second
# EEG window immediately BEFORE that onset as the model input.
#
# The probe sequence is assumed to be:
#   Q1 meditation depth
#   Q2 mind wandering
#   Q3 drowsiness
#
# This pipeline uses Q2 as the binary target. The public events sidecar clearly
# defines the button codes (2, 4, 8) but does not fully spell out the natural-
# language semantics of each response choice, so this mapping should be verified
# against the task materials before treating results as final.
Q2_RESPONSE_TO_LABEL: Dict[int, str | None] = {
    2: "meditation",
    4: "mind_wandering",
    8: "mind_wandering",
}

# Use a stable central subset when available. Falls back to all EEG channels.
PREFERRED_CHANNELS = ["Fz", "FCz", "Cz", "Pz", "F3", "F4", "C3", "C4", "P3", "P4"]

DEBUG_MAX_SUBJECTS = None
DEBUG_PRINT_CHANNELS = True


# ============================================================
# Feature extraction
# ============================================================

BANDS = {
    "delta": (0.5, 4.0),
    "theta": (4.0, 8.0),
    "alpha": (8.0, 12.0),
    "sigma": (12.0, 16.0),
    "beta": (16.0, 30.0),
}


def eeg_feature_names(channel_names: Sequence[str]) -> List[str]:
    names: List[str] = []
    for ch_name in channel_names:
        for band in BANDS:
            names.append(f"{ch_name}_{band}_abs")
            names.append(f"{ch_name}_{band}_rel")
        names.extend(
            [
                f"{ch_name}_theta_alpha_ratio",
                f"{ch_name}_delta_beta_ratio",
                f"{ch_name}_sigma_theta_ratio",
                f"{ch_name}_mean",
                f"{ch_name}_std",
                f"{ch_name}_rms",
                f"{ch_name}_zcr",
            ]
        )

    for band in BANDS:
        names.append(f"global_{band}_abs_mean")
        names.append(f"global_{band}_rel_mean")
    names.extend(
        [
            "global_theta_alpha_ratio_mean",
            "global_delta_beta_ratio_mean",
            "global_sigma_theta_ratio_mean",
            "global_std_mean",
            "global_rms_mean",
        ]
    )
    return names


def eeg_features(eeg: np.ndarray, fs: float) -> np.ndarray:
    if eeg.ndim != 2:
        raise ValueError(f"Expected 2D EEG array, got shape {eeg.shape}")

    feats: List[float] = []
    per_channel_band_abs: Dict[str, List[float]] = {k: [] for k in BANDS}
    per_channel_band_rel: Dict[str, List[float]] = {k: [] for k in BANDS}
    ratio_ta: List[float] = []
    ratio_db: List[float] = []
    ratio_st: List[float] = []
    stds: List[float] = []
    rmss: List[float] = []

    for ch in range(eeg.shape[0]):
        x = eeg[ch].astype(np.float64)
        f, psd = welch(x, fs=fs, nperseg=min(256, len(x)))
        total = float(np.sum(psd) + 1e-12)

        band_vals: Dict[str, float] = {}
        for name, (lo, hi) in BANDS.items():
            mask = (f >= lo) & (f < hi)
            val = float(np.sum(psd[mask])) if np.any(mask) else 0.0
            rel = val / total
            feats.append(val)
            feats.append(rel)
            band_vals[name] = val
            per_channel_band_abs[name].append(val)
            per_channel_band_rel[name].append(rel)

        ta = band_vals["theta"] / (band_vals["alpha"] + 1e-12)
        db = band_vals["delta"] / (band_vals["beta"] + 1e-12)
        st = band_vals["sigma"] / (band_vals["theta"] + 1e-12)
        ch_std = float(np.std(x))
        ch_rms = float(np.sqrt(np.mean(x ** 2)))

        feats.extend(
            [
                ta,
                db,
                st,
                float(np.mean(x)),
                ch_std,
                ch_rms,
                float(np.mean(np.diff(np.signbit(x)) != 0)) if len(x) > 1 else 0.0,
            ]
        )

        ratio_ta.append(ta)
        ratio_db.append(db)
        ratio_st.append(st)
        stds.append(ch_std)
        rmss.append(ch_rms)

    for band in BANDS:
        feats.append(float(np.mean(per_channel_band_abs[band])) if per_channel_band_abs[band] else 0.0)
        feats.append(float(np.mean(per_channel_band_rel[band])) if per_channel_band_rel[band] else 0.0)

    feats.extend(
        [
            float(np.mean(ratio_ta)) if ratio_ta else 0.0,
            float(np.mean(ratio_db)) if ratio_db else 0.0,
            float(np.mean(ratio_st)) if ratio_st else 0.0,
            float(np.mean(stds)) if stds else 0.0,
            float(np.mean(rmss)) if rmss else 0.0,
        ]
    )

    return np.asarray(feats, dtype=np.float32)


# ============================================================
# Dataset loading
# ============================================================

def pick_channels(raw: mne.io.BaseRaw, preferred_channels: Sequence[str]) -> List[str]:
    eeg_picks = mne.pick_types(raw.info, eeg=True, exclude="bads")
    eeg_names = [raw.ch_names[i] for i in eeg_picks]
    if not eeg_names:
        raise ValueError("No EEG channels found after MNE type selection")

    if preferred_channels:
        chosen = [ch for ch in preferred_channels if ch in eeg_names]
        if len(chosen) >= 4:
            return chosen

    return eeg_names


def _find_recording_pairs(sub_dir: Path) -> List[Tuple[Path, Path]]:
    pairs: List[Tuple[Path, Path]] = []

    for eeg_dir in sorted(sub_dir.glob("**/eeg")):
        if not eeg_dir.is_dir():
            continue

        for eeg_path in sorted(eeg_dir.iterdir()):
            if eeg_path.suffix.lower() not in {".edf", ".bdf", ".set", ".fif"}:
                continue
            if "task-meditation" not in eeg_path.name:
                continue
            if f"_eeg{eeg_path.suffix}" not in eeg_path.name:
                continue

            events_path = eeg_path.with_name(
                eeg_path.name.replace(f"_eeg{eeg_path.suffix}", "_events.tsv")
            )
            if events_path.exists():
                pairs.append((eeg_path, events_path))

    return pairs


def _read_raw_any(eeg_path: Path) -> mne.io.BaseRaw:
    suffix = eeg_path.suffix.lower()
    if suffix == ".edf":
        return mne.io.read_raw_edf(eeg_path, preload=True, verbose="ERROR")
    if suffix == ".bdf":
        return mne.io.read_raw_bdf(eeg_path, preload=True, verbose="ERROR")
    if suffix == ".set":
        return mne.io.read_raw_eeglab(eeg_path, preload=True, verbose="ERROR")
    if suffix == ".fif":
        return mne.io.read_raw_fif(eeg_path, preload=True, verbose="ERROR")
    raise ValueError(f"Unsupported EEG format: {eeg_path}")


def extract_probe_label(events_df: pd.DataFrame, onset_idx: int) -> str | None:
    """
    Probe format assumption:
      - current row is stimulus / value=128
      - next response rows correspond to Q1, Q2, Q3
      - Q2 is the binary target
    """
    responses: List[int] = []
    for j in range(onset_idx + 1, len(events_df)):
        row = events_df.iloc[j]
        trial_type = str(row.get("trial_type", "")).strip().lower()
        value = row.get("value")

        if trial_type == "stimulus" and pd.notna(value) and int(value) == 128:
            break

        if trial_type == "response" and pd.notna(value):
            value_int = int(value)
            if value_int in (2, 4, 8):
                responses.append(value_int)
            if len(responses) == 3:
                break

    if len(responses) < 2:
        return None

    q2_value = responses[1]
    return Q2_RESPONSE_TO_LABEL.get(q2_value)


def load_eeg_from_ds001787(
    ds_root: Path,
    window_sec: float = WINDOW_SEC,
    max_subjects: int | None = None,
    print_channels: bool = False,
) -> Tuple[List[np.ndarray], List[str], List[str], List[str], float]:
    all_epochs: List[np.ndarray] = []
    all_labels: List[str] = []
    all_groups: List[str] = []
    canonical_channels: List[str] | None = None
    canonical_sfreq: float | None = None

    subject_dirs = sorted([p for p in ds_root.glob("sub-*") if p.is_dir()])
    if max_subjects is not None:
        subject_dirs = subject_dirs[:max_subjects]
    if not subject_dirs:
        raise ValueError(f"No sub-* directories found under {ds_root}")

    for sub_dir in subject_dirs:
        pairs = _find_recording_pairs(sub_dir)
        if not pairs:
            print(f"[EEG] Skipping {sub_dir.name}: no meditation EEG/events pairs found")
            continue

        subj_kept = 0
        for eeg_path, events_path in pairs:
            try:
                raw = _read_raw_any(eeg_path)
                raw.filter(LOWCUT, HIGHCUT, verbose="ERROR")
            except Exception as e:
                print(f"[EEG] Skipping {eeg_path.name}: read/filter failed: {type(e).__name__}: {e}")
                continue

            selected_channels = pick_channels(raw, PREFERRED_CHANNELS)
            raw.pick(selected_channels)

            sfreq = float(raw.info["sfreq"])
            window_samples = int(round(window_sec * sfreq))
            if window_samples <= 1:
                print(f"[EEG] Skipping {eeg_path.name}: invalid window_samples={window_samples}")
                continue

            if print_channels and canonical_channels is None:
                print(f"[DEBUG] selected channels: {selected_channels}")

            try:
                events_df = pd.read_csv(events_path, sep="\t")
            except Exception as e:
                print(f"[EEG] Skipping {events_path.name}: could not read TSV: {type(e).__name__}: {e}")
                continue

            required_cols = {"onset", "trial_type", "value"}
            missing_cols = required_cols - set(events_df.columns)
            if missing_cols:
                print(f"[EEG] Skipping {events_path.name}: missing columns {sorted(missing_cols)}")
                continue

            if canonical_channels is None:
                canonical_channels = list(raw.ch_names)
                canonical_sfreq = sfreq
            else:
                overlap = [ch for ch in canonical_channels if ch in raw.ch_names]
                if len(overlap) < 4:
                    print(f"[EEG] Skipping {eeg_path.name}: channel overlap too small ({len(overlap)})")
                    continue
                if overlap != canonical_channels:
                    canonical_channels = overlap
                if list(raw.ch_names) != canonical_channels:
                    raw.pick(canonical_channels)

            if canonical_sfreq is not None and abs(sfreq - canonical_sfreq) > 1e-6:
                raw.resample(canonical_sfreq, npad="auto")
                sfreq = canonical_sfreq
                window_samples = int(round(window_sec * sfreq))

            for i, row in events_df.iterrows():
                trial_type = str(row.get("trial_type", "")).strip().lower()
                value = row.get("value")
                if trial_type != "stimulus" or pd.isna(value) or int(value) != 128:
                    continue

                label = extract_probe_label(events_df, i)
                if label not in TARGET_LABELS:
                    continue

                onset_sec = float(row["onset"])
                stop_sample = int(round(onset_sec * sfreq))
                start_sample = stop_sample - window_samples
                if start_sample < 0 or stop_sample > raw.n_times:
                    continue

                segment = raw.get_data(start=start_sample, stop=stop_sample)
                if segment.shape != (len(canonical_channels), window_samples):
                    continue

                all_epochs.append(segment.astype(np.float32))
                all_labels.append(label)
                all_groups.append(sub_dir.name)
                subj_kept += 1

        print(f"[EEG] {sub_dir.name}: kept={subj_kept}")

    if not all_epochs or canonical_channels is None or canonical_sfreq is None:
        raise ValueError("No usable EEG samples were built from ds001787")

    final_n_channels = len(canonical_channels)
    final_epochs: List[np.ndarray] = []
    final_labels: List[str] = []
    final_groups: List[str] = []
    for epoch, label, group in zip(all_epochs, all_labels, all_groups):
        if epoch.shape[0] == final_n_channels:
            final_epochs.append(epoch)
            final_labels.append(label)
            final_groups.append(group)

    print(f"[EEG] total_epochs={len(final_epochs)}")
    print(f"[EEG] class_counts={pd.Series(final_labels).value_counts().to_dict()}")
    print(f"[EEG] groups={pd.Series(final_groups).value_counts().to_dict()}")

    return final_epochs, final_labels, final_groups, canonical_channels, canonical_sfreq


# ============================================================
# Feature matrix builder
# ============================================================

def build_eeg_dataset(
    eeg_epochs: Sequence[np.ndarray],
    eeg_labels: Sequence[str],
    channel_names: Sequence[str],
    fs: float,
) -> Tuple[np.ndarray, np.ndarray]:
    X: List[np.ndarray] = []
    y: List[str] = []

    for epoch, label in zip(eeg_epochs, eeg_labels):
        if label not in TARGET_LABELS:
            continue
        X.append(eeg_features(epoch, fs=fs))
        y.append(label)

    if not X:
        raise ValueError("No EEG samples were built. Check loading and label parsing.")

    X_arr = np.vstack(X).astype(np.float32)
    y_arr = np.asarray(y)

    expected = len(eeg_feature_names(channel_names))
    if X_arr.shape[1] != expected:
        raise ValueError(f"Feature mismatch: got {X_arr.shape[1]}, expected {expected}")

    return X_arr, y_arr


# ============================================================
# Training / evaluation / export
# ============================================================

def make_model() -> Pipeline:
    return Pipeline(
        [
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
            (
                "clf",
                LogisticRegression(
                    max_iter=1000,
                    class_weight="balanced",
                    solver="lbfgs",
                ),
            ),
        ]
    )


def run_lopo_cv(X: np.ndarray, y: np.ndarray, groups: np.ndarray) -> dict:
    logo = LeaveOneGroupOut()

    fold_rows = []
    y_true_all: List[str] = []
    y_pred_all: List[str] = []

    for fold_idx, (train_idx, test_idx) in enumerate(logo.split(X, y, groups), start=1):
        held_out = str(groups[test_idx][0])
        model = make_model()
        model.fit(X[train_idx], y[train_idx])
        y_pred = model.predict(X[test_idx])
        acc = float(accuracy_score(y[test_idx], y_pred))

        fold_rows.append(
            {
                "fold": fold_idx,
                "held_out_subject": held_out,
                "n_train": int(len(train_idx)),
                "n_test": int(len(test_idx)),
                "accuracy": acc,
            }
        )
        y_true_all.extend(y[test_idx].tolist())
        y_pred_all.extend(y_pred.tolist())

    labels = list(TARGET_LABELS)
    report = classification_report(y_true_all, y_pred_all, labels=labels, output_dict=True, zero_division=0)
    cm = confusion_matrix(y_true_all, y_pred_all, labels=labels)

    return {
        "cv_scheme": "LeaveOneGroupOut",
        "group_name": "subject_id",
        "n_subjects": int(len(np.unique(groups))),
        "n_samples": int(len(y)),
        "folds": fold_rows,
        "mean_accuracy": float(np.mean([r["accuracy"] for r in fold_rows])) if fold_rows else None,
        "std_accuracy": float(np.std([r["accuracy"] for r in fold_rows])) if fold_rows else None,
        "classification_report": report,
        "confusion_matrix": {
            "labels": labels,
            "matrix": cm.tolist(),
        },
    }


def export_onnx(model: Pipeline, n_features: int, path: Path) -> None:
    onnx_model = convert_sklearn(
        model,
        initial_types=[("input", FloatTensorType([None, n_features]))],
    )
    path.write_bytes(onnx_model.SerializeToString())


def save_json(path: Path, payload: dict) -> None:
    path.write_text(json.dumps(payload, indent=2), encoding="utf-8")


def train_and_export(ds_root: Path, out_dir: Path) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)

    epochs, labels, groups, channel_names, fs = load_eeg_from_ds001787(
        ds_root=ds_root,
        window_sec=WINDOW_SEC,
        max_subjects=DEBUG_MAX_SUBJECTS,
        print_channels=DEBUG_PRINT_CHANNELS,
    )

    X, y = build_eeg_dataset(epochs, labels, channel_names, fs)
    groups_arr = np.asarray(groups)

    print(f"[DEBUG] X shape: {X.shape}")
    print(f"[DEBUG] y counts: {pd.Series(y).value_counts().to_dict()}")
    print(f"[DEBUG] subject counts: {pd.Series(groups_arr).value_counts().to_dict()}")

    lopo_summary = run_lopo_cv(X, y, groups_arr)

    final_model = make_model()
    final_model.fit(X, y)

    joblib.dump(final_model, out_dir / "meditation_model.joblib")
    export_onnx(final_model, X.shape[1], out_dir / "meditation_model.onnx")

    save_json(
        out_dir / "feature_schema.json",
        {
            "input_name": "input",
            "dtype": "float32",
            "window_sec": WINDOW_SEC,
            "sampling_rate_hz": fs,
            "channel_names": list(channel_names),
            "feature_names": eeg_feature_names(channel_names),
            "outputs": TARGET_LABELS,
            "notes": (
                "Binary EEG-only meditation classifier. Input to ONNX is the engineered feature vector, "
                "not raw EEG. Features are computed from the 5-second EEG window immediately preceding each probe onset."
            ),
        },
    )

    save_json(
        out_dir / "training_summary.json",
        {
            "dataset": "OpenNeuro ds001787",
            "task": "binary meditation vs mind_wandering",
            "window_sec": WINDOW_SEC,
            "n_samples": int(len(y)),
            "n_subjects": int(len(np.unique(groups_arr))),
            "class_counts": pd.Series(y).value_counts().to_dict(),
            "subjects": sorted(np.unique(groups_arr).tolist()),
            "labeling": {
                "probe_anchor": "trial_type=stimulus,value=128",
                "target_question": "Q2 mind wandering",
                "response_to_label": {str(k): v for k, v in Q2_RESPONSE_TO_LABEL.items()},
                "warning": (
                    "The event sidecar documents response button codes but not the natural-language answer text. "
                    "Verify this response mapping against the paper/task materials before treating results as final."
                ),
            },
            "cross_validation": lopo_summary,
            "artifacts": [
                "meditation_model.joblib",
                "meditation_model.onnx",
                "feature_schema.json",
                "training_summary.json",
            ],
        },
    )

    print(f"Artifacts written to: {out_dir.resolve()}")


# ============================================================
# Main
# ============================================================

def main() -> None:
    ds_root = Path.home() / "datasets" / "ds001787"
    out_dir = Path("artifacts")

    print(f"[DEBUG] ds_root={ds_root}")
    train_and_export(ds_root=ds_root, out_dir=out_dir)


if __name__ == "__main__":
    main()
