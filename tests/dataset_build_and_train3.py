from __future__ import annotations

import json
from pathlib import Path
from typing import List, Sequence, Tuple

import joblib
import mne
import numpy as np
import pandas as pd
from scipy.signal import welch
from scipy.stats import iqr
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType


# ============================================================
# Config
# ============================================================

EPOCH_SEC = 30
EEG_CHANNELS = 2
EEG_FS = 256
IMU_FS = 30
STAGE_LABELS = ["Wake", "N1", "N2", "N3", "REM"]

# Debug controls
DEBUG_SUBJECT_IDS = ["sub-1", "sub-2", "sub-3", "sub-4", "sub-5"]
DEBUG_MAX_SUBJECTS = None
DEBUG_EEG_ONLY = False
DEBUG_EEG_FEATURES_ONLY = False
DEBUG_PRINT_CHANNELS = True


# ============================================================
# Feature extraction
# ============================================================

def eeg_feature_names() -> List[str]:
    names: List[str] = []
    bands = ["delta", "theta", "alpha", "sigma", "beta"]
    for ch in range(EEG_CHANNELS):
        for band in bands:
            names.append(f"eeg_ch{ch}_{band}_abs")
            names.append(f"eeg_ch{ch}_{band}_rel")
        names.extend(
            [
                f"eeg_ch{ch}_theta_alpha_ratio",
                f"eeg_ch{ch}_delta_beta_ratio",
                f"eeg_ch{ch}_sigma_theta_ratio",
                f"eeg_ch{ch}_mean",
                f"eeg_ch{ch}_std",
                f"eeg_ch{ch}_rms",
                f"eeg_ch{ch}_zcr",
            ]
        )
    return names


def eeg_features(eeg: np.ndarray, fs: float = EEG_FS) -> np.ndarray:
    """
    eeg shape: (EEG_CHANNELS, n_samples)
    """
    if eeg.shape[0] != EEG_CHANNELS:
        raise ValueError(f"Expected {EEG_CHANNELS} EEG channels, got {eeg.shape[0]}")

    feats: List[float] = []
    bands = {
        "delta": (0.5, 4.0),
        "theta": (4.0, 8.0),
        "alpha": (8.0, 12.0),
        "sigma": (12.0, 16.0),
        "beta": (16.0, 30.0),
    }

    for ch in range(EEG_CHANNELS):
        x = eeg[ch].astype(float)
        f, psd = welch(x, fs=fs, nperseg=min(256, len(x)))
        total = float(np.sum(psd) + 1e-12)

        band_vals = {}
        for name, (lo, hi) in bands.items():
            mask = (f >= lo) & (f < hi)
            val = float(np.sum(psd[mask])) if np.any(mask) else 0.0
            feats.append(val)
            feats.append(val / total)
            band_vals[name] = val

        feats.append(band_vals["theta"] / (band_vals["alpha"] + 1e-12))
        feats.append(band_vals["delta"] / (band_vals["beta"] + 1e-12))
        feats.append(band_vals["sigma"] / (band_vals["theta"] + 1e-12))
        feats.append(float(np.mean(x)))
        feats.append(float(np.std(x)))
        feats.append(float(np.sqrt(np.mean(x ** 2))))
        feats.append(float(np.mean(np.diff(np.signbit(x)) != 0)) if len(x) > 1 else 0.0)

    return np.asarray(feats, dtype=np.float32)


def imu_feature_names() -> List[str]:
    return [
        "imu_mag_mean",
        "imu_mag_std",
        "imu_mag_var",
        "imu_mag_median",
        "imu_mag_iqr",
        "imu_mag_rms",
        "imu_activity_sum_abs_diff",
        "imu_jerk_mean",
        "imu_jerk_std",
        "imu_psd_total_power",
        "imu_peak_frequency",
        "imu_pct_quiet",
        "imu_pct_active",
    ]


def imu_features(accel: np.ndarray, fs: float = IMU_FS) -> np.ndarray:
    """
    accel shape: (n_samples, 3)
    """
    mag = np.sqrt(np.sum(accel.astype(float) ** 2, axis=1))
    f, psd = welch(mag, fs=fs, nperseg=min(256, len(mag)))

    feats = [
        float(np.mean(mag)),
        float(np.std(mag)),
        float(np.var(mag)),
        float(np.median(mag)),
        float(iqr(mag)),
        float(np.sqrt(np.mean(mag ** 2))),
        float(np.sum(np.abs(np.diff(mag)))) if len(mag) > 1 else 0.0,
        float(np.mean(np.abs(np.diff(mag)))) if len(mag) > 1 else 0.0,
        float(np.std(np.diff(mag))) if len(mag) > 1 else 0.0,
        float(np.sum(psd)),
        float(f[np.argmax(psd)]) if len(f) else 0.0,
        float(np.mean(mag < np.percentile(mag, 25))),
        float(np.mean(mag > np.percentile(mag, 75))),
    ]
    return np.asarray(feats, dtype=np.float32)


# ============================================================
# EEG helpers
# ============================================================

def normalize_stage_label(label) -> str | None:
    if pd.isna(label):
        return None

    text = str(label).strip().lower()

    mapping = {
        "0": "Wake",
        "wake": "Wake",
        "w": "Wake",

        "1": "N1",
        "n1": "N1",
        "nrem1": "N1",
        "sleep stage n1": "N1",

        "2": "N2",
        "n2": "N2",
        "nrem2": "N2",
        "sleep stage n2": "N2",

        "3": "N3",
        "n3": "N3",
        "nrem3": "N3",
        "sleep stage n3": "N3",

        "4": "REM",
        "rem": "REM",
        "r": "REM",
        "sleep stage r": "REM",

        "-2": None,
        "8": None,
        "nan": None,
        "none": None,
        "unknown": None,
    }
    return mapping.get(text, None)


def is_probably_placeholder(path: Path, min_bytes: int = 4096) -> bool:
    """
    Heuristic for placeholder/unusable EDF.
    """
    try:
        if not path.exists():
            return True
        return path.stat().st_size < min_bytes
    except Exception:
        return True


def pick_first_n_channels(raw: mne.io.BaseRaw, n_channels: int = EEG_CHANNELS) -> List[str]:
    """
    Current debug strategy: take first N channels.
    """
    return raw.ch_names[:n_channels]


# ============================================================
# EEG dataset builder
# ============================================================

def build_eeg_dataset(
    eeg_epochs: Sequence[np.ndarray],
    eeg_labels: Sequence[str],
) -> Tuple[np.ndarray, np.ndarray]:
    X: List[np.ndarray] = []
    y: List[str] = []

    for epoch, label in zip(eeg_epochs, eeg_labels):
        if label not in STAGE_LABELS:
            continue
        X.append(eeg_features(epoch, fs=EEG_FS))
        y.append(label)

    if not X:
        raise ValueError("No EEG samples were built. Check EEG loading and labels.")

    return np.vstack(X).astype(np.float32), np.asarray(y)


def load_eeg_from_ds005555(
    ds_root: Path,
    max_subjects: int | None = None,
    subject_ids: Sequence[str] | None = None,
    strict: bool = False,
    print_channels: bool = False,
) -> Tuple[List[np.ndarray], List[str]]:
    """
    Loads 30-second EEG epochs and stage labels from ds005555.

    Uses:
      - headband EDF for EEG signal
      - PSG events TSV for human labels (stage_hum)
    """
    eeg_epochs: List[np.ndarray] = []
    eeg_labels: List[str] = []

    subject_dirs = sorted([p for p in ds_root.glob("sub-*") if p.is_dir()])

    if subject_ids is not None:
        wanted = set(subject_ids)
        subject_dirs = [p for p in subject_dirs if p.name in wanted]

    if not subject_dirs:
        raise ValueError(f"No matching sub-* directories found under {ds_root}")

    subjects_seen = 0
    subjects_loaded = 0
    subjects_skipped = 0
    first_loaded_subject_printed = False

    for sub_dir in subject_dirs:
        if max_subjects is not None and subjects_seen >= max_subjects:
            break
        subjects_seen += 1

        eeg_dir = sub_dir / "eeg"
        edf_files = sorted(eeg_dir.glob("*_task-Sleep_acq-headband_eeg.edf"))
        psg_event_files = sorted(eeg_dir.glob("*_task-Sleep_acq-psg_events.tsv"))

        if not edf_files or not psg_event_files:
            print(f"[EEG] Skipping {sub_dir.name}: missing headband EDF or PSG events TSV")
            subjects_skipped += 1
            continue

        edf_path = edf_files[0]
        events_path = psg_event_files[0]

        if is_probably_placeholder(edf_path):
            try:
                size_bytes = edf_path.stat().st_size
                size_msg = f"{size_bytes} bytes"
            except FileNotFoundError:
                size_msg = "missing"
            print(f"[EEG] Skipping {sub_dir.name}: EDF looks like placeholder/unusable file ({size_msg})")
            subjects_skipped += 1
            continue

        try:
            raw = mne.io.read_raw_edf(edf_path, preload=True, verbose="ERROR")
            raw.filter(0.5, 30.0, verbose="ERROR")
        except Exception as e:
            msg = f"[EEG] Skipping {sub_dir.name}: could not read EDF {edf_path.name}: {type(e).__name__}: {e}"
            if strict:
                raise RuntimeError(msg) from e
            print(msg)
            subjects_skipped += 1
            continue

        selected_channels = pick_first_n_channels(raw, EEG_CHANNELS)
        if len(selected_channels) < EEG_CHANNELS:
            print(f"[EEG] Skipping {sub_dir.name}: only {len(selected_channels)} channels found, need {EEG_CHANNELS}")
            subjects_skipped += 1
            continue

        if print_channels and not first_loaded_subject_printed:
            print(f"[DEBUG] {sub_dir.name} all channels: {raw.ch_names}")
            print(f"[DEBUG] {sub_dir.name} selected channels: {selected_channels}")
            first_loaded_subject_printed = True

        raw.pick(selected_channels)

        sfreq = float(raw.info["sfreq"])
        epoch_samples = int(round(EPOCH_SEC * sfreq))

        try:
            events_df = pd.read_csv(events_path, sep="\t")
        except Exception as e:
            msg = f"[EEG] Skipping {sub_dir.name}: could not read events TSV {events_path.name}: {type(e).__name__}: {e}"
            if strict:
                raise RuntimeError(msg) from e
            print(msg)
            subjects_skipped += 1
            continue

        required_cols = {"onset", "stage_hum"}
        missing_cols = required_cols - set(events_df.columns)
        if missing_cols:
            print(f"[EEG] Skipping {sub_dir.name}: missing columns {sorted(missing_cols)} in {events_path.name}")
            subjects_skipped += 1
            continue

        n_before = len(eeg_epochs)
        subj_kept = 0
        subj_dropped_label = 0
        subj_dropped_bounds = 0
        subj_dropped_shape = 0

        for _, row in events_df.iterrows():
            try:
                label = normalize_stage_label(row["stage_hum"])
                if label not in STAGE_LABELS:
                    subj_dropped_label += 1
                    continue

                onset_sec = float(row["onset"])
                duration_sec = (
                    float(row["duration"])
                    if "duration" in events_df.columns and pd.notna(row["duration"])
                    else EPOCH_SEC
                )

                if duration_sec < EPOCH_SEC:
                    continue

                n_full_epochs = int(duration_sec // EPOCH_SEC)

                for k in range(n_full_epochs):
                    start_sec = onset_sec + k * EPOCH_SEC
                    start_sample = int(round(start_sec * sfreq))
                    stop_sample = start_sample + epoch_samples

                    if stop_sample > raw.n_times:
                        subj_dropped_bounds += 1
                        continue

                    segment = raw.get_data(start=start_sample, stop=stop_sample)
                    if segment.shape != (EEG_CHANNELS, epoch_samples):
                        subj_dropped_shape += 1
                        continue

                    eeg_epochs.append(segment.astype(np.float32))
                    eeg_labels.append(label)
                    subj_kept += 1

            except Exception as e:
                print(f"[EEG] Malformed row in {events_path.name}: {type(e).__name__}: {e}")
                continue

        if len(eeg_epochs) > n_before:
            subjects_loaded += 1
            print(
                f"[EEG] {sub_dir.name}: kept={subj_kept}, "
                f"dropped_label={subj_dropped_label}, "
                f"dropped_bounds={subj_dropped_bounds}, "
                f"dropped_shape={subj_dropped_shape}"
            )
        else:
            subjects_skipped += 1
            print(f"[EEG] {sub_dir.name}: no usable epochs built")

    if not eeg_epochs:
        raise ValueError("No EEG epochs were built from ds005555. Check EDFs, channels, and stage parsing.")

    print(f"[EEG] subjects_seen={subjects_seen} loaded={subjects_loaded} skipped={subjects_skipped} epochs={len(eeg_epochs)}")
    print(f"[EEG] class_counts={pd.Series(eeg_labels).value_counts().to_dict()}")

    return eeg_epochs, eeg_labels


# ============================================================
# IMU dataset builder
# ============================================================

def _make_timestamp_series(day_series: pd.Series, time_series: pd.Series) -> pd.Series:
    combined = day_series.astype(str).str.strip() + " " + time_series.astype(str).str.strip()
    return pd.to_datetime(combined, errors="coerce")


def _extract_sleep_intervals(sleep_df: pd.DataFrame) -> List[Tuple[pd.Timestamp, pd.Timestamp]]:
    intervals: List[Tuple[pd.Timestamp, pd.Timestamp]] = []

    required_cols = ["In Bed Date", "In Bed Time", "Out Bed Date", "Out Bed Time"]
    missing = [c for c in required_cols if c not in sleep_df.columns]
    if missing:
        raise ValueError(f"Sleep.csv missing columns: {missing}")

    for _, row in sleep_df.iterrows():
        start = pd.to_datetime(f"{row['In Bed Date']} {row['In Bed Time']}", errors="coerce")
        end = pd.to_datetime(f"{row['Out Bed Date']} {row['Out Bed Time']}", errors="coerce")
        if pd.notna(start) and pd.notna(end) and end >= start:
            intervals.append((start, end))

    return intervals


def _is_sleep(ts: pd.Timestamp, intervals: Sequence[Tuple[pd.Timestamp, pd.Timestamp]]) -> int:
    for start, end in intervals:
        if start <= ts <= end:
            return 1
    return 0


def build_imu_dataset(data_paper_root: Path) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
    X: List[np.ndarray] = []
    y: List[int] = []
    groups: List[str] = []

    user_dirs = sorted([p for p in data_paper_root.glob("user_*") if p.is_dir()])
    if not user_dirs:
        raise ValueError(f"No user_* directories found under {data_paper_root}")

    for user_dir in user_dirs:
        actigraph_path = user_dir / "Actigraph.csv"
        sleep_path = user_dir / "Sleep.csv"
        if not actigraph_path.exists() or not sleep_path.exists():
            continue

        df = pd.read_csv(actigraph_path)
        sleep_df = pd.read_csv(sleep_path)

        required_act_cols = ["Axis1", "Axis2", "Axis3", "day", "time"]
        missing_act = [c for c in required_act_cols if c not in df.columns]
        if missing_act:
            raise ValueError(f"{actigraph_path} missing columns: {missing_act}")

        df["timestamp"] = _make_timestamp_series(df["day"], df["time"])
        df = df.dropna(subset=["timestamp"]).copy()
        if df.empty:
            continue

        intervals = _extract_sleep_intervals(sleep_df)
        if not intervals:
            continue

        df["sleep_label"] = df["timestamp"].apply(lambda ts: _is_sleep(ts, intervals))

        dt = df["timestamp"].diff().dt.total_seconds().median()
        if pd.isna(dt) or dt <= 0:
            fs = IMU_FS
        else:
            fs = int(round(1.0 / dt))
            if fs <= 0:
                fs = IMU_FS

        epoch_len = int(fs * EPOCH_SEC)
        if epoch_len <= 1:
            continue

        accel = df[["Axis1", "Axis2", "Axis3"]].to_numpy(dtype=np.float32)
        labels = df["sleep_label"].to_numpy(dtype=np.int64)

        for start in range(0, len(accel) - epoch_len + 1, epoch_len):
            seg = accel[start:start + epoch_len]
            lab = int(labels[start:start + epoch_len].mean() >= 0.5)
            if len(seg) < epoch_len:
                continue
            X.append(imu_features(seg, fs=fs))
            y.append(lab)
            groups.append(user_dir.name)

    if not X:
        raise ValueError("No IMU samples were built. Check DataPaper paths and CSV formats.")

    return np.vstack(X).astype(np.float32), np.asarray(y, dtype=np.int64), np.asarray(groups)


# ============================================================
# Training / export
# ============================================================

def train_stage_model(X_eeg: np.ndarray, y_stage: np.ndarray, out_dir: Path):
    print(f"[DEBUG] Training stage model with X_eeg={X_eeg.shape}, y_stage={pd.Series(y_stage).value_counts().to_dict()}")

    model = Pipeline(
        [
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
            ("clf", LogisticRegression(
                max_iter=1000,
                class_weight="balanced",
                solver="lbfgs",
            )),
        ]
    )
    model.fit(X_eeg, y_stage)
    joblib.dump(model, out_dir / "stage_model.joblib")
    return model


def train_sleep_gate_model(X_imu: np.ndarray, y_sleep: np.ndarray, out_dir: Path):
    print(f"[DEBUG] Training sleep gate with X_imu={X_imu.shape}, y_sleep={pd.Series(y_sleep).value_counts().to_dict()}")

    model = Pipeline(
        [
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
            ("clf", LogisticRegression(
                max_iter=1000,
                class_weight="balanced",
                solver="lbfgs",
            )),
        ]
    )
    model.fit(X_imu, y_sleep)
    joblib.dump(model, out_dir / "sleep_gate.joblib")
    return model


def export_onnx(model, n_features: int, path: Path) -> None:
    onnx_model = convert_sklearn(
        model,
        initial_types=[("input", FloatTensorType([None, n_features]))],
    )
    path.write_bytes(onnx_model.SerializeToString())


def save_json(path: Path, payload: dict) -> None:
    path.write_text(json.dumps(payload, indent=2), encoding="utf-8")


def train_and_export(
    eeg_epochs: Sequence[np.ndarray],
    eeg_labels: Sequence[str],
    data_paper_root: Path,
    out_dir: Path,
) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)

    X_eeg, y_stage = build_eeg_dataset(eeg_epochs, eeg_labels)
    X_imu, y_sleep, imu_groups = build_imu_dataset(data_paper_root)

    stage_model = train_stage_model(X_eeg, y_stage, out_dir)
    sleep_gate_model = train_sleep_gate_model(X_imu, y_sleep, out_dir)

    export_onnx(stage_model, X_eeg.shape[1], out_dir / "stage_model.onnx")
    export_onnx(sleep_gate_model, X_imu.shape[1], out_dir / "sleep_gate.onnx")

    save_json(
        out_dir / "stage_feature_schema.json",
        {
            "input_name": "input",
            "dtype": "float32",
            "epoch_sec": EPOCH_SEC,
            "feature_names": eeg_feature_names(),
            "outputs": STAGE_LABELS,
            "notes": "EEG stage model. Built from epoch-synchronous EEG windows.",
        },
    )

    save_json(
        out_dir / "sleep_gate_feature_schema.json",
        {
            "input_name": "input",
            "dtype": "float32",
            "epoch_sec": EPOCH_SEC,
            "feature_names": imu_feature_names(),
            "outputs": ["awake", "asleep"],
            "notes": "IMU sleep gate. No gyro. Built from DataPaper/user_*/Actigraph.csv + Sleep.csv.",
        },
    )

    save_json(
        out_dir / "fusion_rule.json",
        {
            "rule": "If EEG stage model is uncertain mainly between Wake and N1, use the IMU sleep gate to decide.",
            "wake_n1_margin": 0.10,
            "sleep_threshold": 0.50,
        },
    )

    save_json(
        out_dir / "training_summary.json",
        {
            "n_eeg_epochs": int(len(y_stage)),
            "n_imu_epochs": int(len(y_sleep)),
            "imu_users": sorted(np.unique(imu_groups).tolist()),
            "stage_classes": sorted(np.unique(y_stage).tolist()),
            "sleep_classes": {
                "awake": int((y_sleep == 0).sum()),
                "asleep": int((y_sleep == 1).sum()),
            },
            "artifacts": [
                "stage_model.joblib",
                "sleep_gate.joblib",
                "stage_model.onnx",
                "sleep_gate.onnx",
                "stage_feature_schema.json",
                "sleep_gate_feature_schema.json",
                "fusion_rule.json",
            ],
        },
    )


# ============================================================
# Main
# ============================================================

def main() -> None:
    out_dir = Path("artifacts")
    data_paper_root = Path("DataPaper")
    ds005555_root = Path.home() / "datasets" / "ds005555"

    print(f"[DEBUG] ds005555_root={ds005555_root}")
    print(f"[DEBUG] data_paper_root={data_paper_root.resolve()}")

    eeg_epochs, eeg_labels = load_eeg_from_ds005555(
        ds_root=ds005555_root,
        max_subjects=DEBUG_MAX_SUBJECTS,
        subject_ids=DEBUG_SUBJECT_IDS,
        strict=False,
        print_channels=DEBUG_PRINT_CHANNELS,
    )

    print(f"[DEBUG] EEG epochs total: {len(eeg_epochs)}")
    print(f"[DEBUG] EEG label counts: {pd.Series(eeg_labels).value_counts().to_dict()}")

    if eeg_epochs:
        print(f"[DEBUG] First epoch shape: {eeg_epochs[0].shape}")
        print(f"[DEBUG] First label: {eeg_labels[0]}")

    if DEBUG_EEG_ONLY:
        print("[DEBUG] Stopping after EEG load check.")
        return

    X_eeg, y_stage = build_eeg_dataset(eeg_epochs, eeg_labels)
    print(f"[DEBUG] X_eeg shape: {X_eeg.shape}")
    print(f"[DEBUG] y_stage shape: {y_stage.shape}")
    print(f"[DEBUG] y_stage counts: {pd.Series(y_stage).value_counts().to_dict()}")

    if DEBUG_EEG_FEATURES_ONLY:
        print("[DEBUG] Stopping after EEG feature build check.")
        return

    train_and_export(
        eeg_epochs=eeg_epochs,
        eeg_labels=eeg_labels,
        data_paper_root=data_paper_root,
        out_dir=out_dir,
    )

    print(f"Artifacts written to: {out_dir.resolve()}")


if __name__ == "__main__":
    main()