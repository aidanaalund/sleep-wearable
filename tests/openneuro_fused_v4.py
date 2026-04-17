from __future__ import annotations

import json
from pathlib import Path
from typing import List, Tuple

import joblib
import mne
import numpy as np
import pandas as pd
from scipy.signal import welch
from scipy.stats import kurtosis, skew
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    balanced_accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
)
from sklearn.model_selection import LeaveOneGroupOut
from sklearn.pipeline import Pipeline

# =============================
# Config
# =============================
EPOCH_SEC = 30
EEG_CHANNELS = 2
IMU_CHANNELS = 3
EEG_FS = 256
IMU_FS = 30
STAGE_LABELS = ["Wake", "N1", "N2", "N3", "REM"]

# =============================
# Feature extraction
# =============================

def hjorth_params(x: np.ndarray) -> tuple[float, float, float]:
    dx = np.diff(x)
    ddx = np.diff(dx)
    var0 = float(np.var(x) + 1e-12)
    var1 = float(np.var(dx) + 1e-12)
    var2 = float(np.var(ddx) + 1e-12)
    activity = var0
    mobility = float(np.sqrt(var1 / var0))
    complexity = float(np.sqrt(var2 / var1) / (mobility + 1e-12))
    return activity, mobility, complexity


def spectral_entropy(psd: np.ndarray) -> float:
    p = psd / (np.sum(psd) + 1e-12)
    return float(-np.sum(p * np.log(p + 1e-12)))


def spectral_edge_frequency(f: np.ndarray, psd: np.ndarray, edge: float = 0.95) -> float:
    cumulative = np.cumsum(psd)
    if len(cumulative) == 0 or cumulative[-1] <= 0:
        return 0.0
    threshold = edge * cumulative[-1]
    idx = int(np.searchsorted(cumulative, threshold, side="left"))
    idx = min(idx, len(f) - 1)
    return float(f[idx])


def eeg_features(eeg: np.ndarray, fs: float = EEG_FS) -> np.ndarray:
    feats = []
    bands = {
        "delta": (0.5, 4.0),
        "theta": (4.0, 8.0),
        "alpha": (8.0, 12.0),
        "sigma": (12.0, 16.0),
        "beta": (16.0, 30.0),
    }

    for ch in range(eeg.shape[0]):
        x = eeg[ch].astype(float)
        f, psd = welch(x, fs=fs, nperseg=min(256, len(x)))
        total = float(np.sum(psd) + 1e-12)

        band_vals = {}
        ch_feats = []
        for name, (lo, hi) in bands.items():
            mask = (f >= lo) & (f < hi)
            val = float(np.sum(psd[mask])) if np.any(mask) else 0.0
            ch_feats.append(val)
            ch_feats.append(val / total)
            band_vals[name] = val

        activity, mobility, complexity = hjorth_params(x)
        peak_freq = float(f[np.argmax(psd)]) if len(f) else 0.0
        sef95 = spectral_edge_frequency(f, psd, edge=0.95)
        sent = spectral_entropy(psd)
        line_length = float(np.sum(np.abs(np.diff(x)))) if len(x) > 1 else 0.0
        zcr = float(np.mean(np.diff(np.signbit(x)) != 0)) if len(x) > 1 else 0.0

        ch_feats.extend([
            band_vals["theta"] / (band_vals["alpha"] + 1e-12),
            band_vals["delta"] / (band_vals["beta"] + 1e-12),
            band_vals["sigma"] / (band_vals["theta"] + 1e-12),
            float(np.mean(x)),
            float(np.std(x)),
            float(np.sqrt(np.mean(x ** 2))),
            float(np.ptp(x)),
            zcr,
            float(skew(x, bias=False)) if len(x) > 2 else 0.0,
            float(kurtosis(x, fisher=True, bias=False)) if len(x) > 3 else 0.0,
            activity,
            mobility,
            complexity,
            line_length,
            peak_freq,
            sef95,
            sent,
        ])

        feats.extend(ch_feats)

    if eeg.shape[0] >= 2:
        x0 = eeg[0].astype(float)
        x1 = eeg[1].astype(float)
        corr = float(np.corrcoef(x0, x1)[0, 1]) if np.std(x0) > 0 and np.std(x1) > 0 else 0.0
        diff_mean = float(np.mean(x0 - x1))
        diff_std = float(np.std(x0 - x1))
        feats.extend([corr, diff_mean, diff_std])

    return np.asarray(feats, dtype=np.float32)


def imu_features(accel: np.ndarray, fs: float = IMU_FS) -> np.ndarray:
    mag = np.sqrt(np.sum(accel.astype(float) ** 2, axis=1))
    f, psd = welch(mag, fs=fs, nperseg=min(256, len(mag)))
    jerk = np.diff(mag)
    q25 = np.percentile(mag, 25) if len(mag) else 0.0
    q75 = np.percentile(mag, 75) if len(mag) else 0.0

    return np.array([
        float(np.mean(mag)),
        float(np.std(mag)),
        float(np.var(mag)),
        float(np.median(mag)),
        float(q75 - q25),
        float(np.sqrt(np.mean(mag ** 2))),
        float(np.sum(np.abs(np.diff(mag)))) if len(mag) > 1 else 0.0,
        float(np.mean(np.abs(jerk))) if len(jerk) else 0.0,
        float(np.std(jerk)) if len(jerk) else 0.0,
        float(np.sum(psd)),
        float(f[np.argmax(psd)]) if len(f) else 0.0,
        float(np.mean(mag < q25)) if len(mag) else 0.0,
        float(np.mean(mag > q75)) if len(mag) else 0.0,
    ], dtype=np.float32)

# =============================
# Helpers
# =============================

def normalize_stage(label):
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


def subject_is_multimodal(sub_dir: Path) -> bool:
    sub = sub_dir.name
    eeg_dir = sub_dir / "eeg"

    ch = eeg_dir / f"{sub}_task-Sleep_acq-headband_channels.tsv"
    if not ch.exists():
        return False

    df = pd.read_csv(ch, sep="	")
    names = [str(x).strip().lower() for x in df["name"]]

    has_eeg = ("hb_1" in names and "hb_2" in names)
    has_imu = sum(n.startswith("hb_imu") for n in names) >= 3
    return has_eeg and has_imu


def pick_eeg_channels(raw):
    return [ch for ch in raw.ch_names if ch.lower() in ("hb_1", "hb_2")]


def pick_imu_channels(raw):
    imu = [ch for ch in raw.ch_names if "hb_imu" in ch.lower()]
    imu = sorted(imu, key=lambda s: int("".join(filter(str.isdigit, s)) or 0))
    return imu[:IMU_CHANNELS]

# =============================
# Data loader
# =============================

def add_temporal_context(X: np.ndarray) -> np.ndarray:
    if len(X) == 0:
        return X
    out = []
    for i in range(len(X)):
        prev_x = X[i - 1] if i > 0 else X[i]
        cur_x = X[i]
        next_x = X[i + 1] if i < len(X) - 1 else X[i]
        out.append(np.concatenate([prev_x, cur_x, next_x]).astype(np.float32))
    return np.vstack(out)




def oversample_n1_n3(X: np.ndarray, y: np.ndarray, target_frac: float = 0.6, random_state: int = 42):
    """Lightly oversample only N1 and N3 up to target_frac * majority_count."""
    if len(X) == 0:
        return X, y
    rng = np.random.default_rng(random_state)
    classes, counts = np.unique(y, return_counts=True)
    count_map = {c: int(n) for c, n in zip(classes, counts)}
    majority = max(count_map.values()) if count_map else 0
    target = int(max(1, round(target_frac * majority)))

    X_parts = [X]
    y_parts = [y]
    for cls in ("N1", "N3"):
        cur = count_map.get(cls, 0)
        if 0 < cur < target:
            idx = np.where(y == cls)[0]
            extra_idx = rng.choice(idx, size=target - cur, replace=True)
            X_parts.append(X[extra_idx])
            y_parts.append(y[extra_idx])

    X_out = np.vstack(X_parts)
    y_out = np.concatenate(y_parts)
    perm = rng.permutation(len(y_out))
    return X_out[perm], y_out[perm]


def load_multimodal(ds_root: Path):
    X_eeg, X_imu, y, groups = [], [], [], []

    subjects = sorted([p for p in ds_root.glob("sub-*") if p.is_dir()])
    subjects = [s for s in subjects if subject_is_multimodal(s)]

    print(f"[INFO] multimodal subjects={len(subjects)}")

    first_debug_printed = False

    for sub_dir in subjects:
        sub = sub_dir.name
        eeg_dir = sub_dir / "eeg"

        edf = eeg_dir / f"{sub}_task-Sleep_acq-headband_eeg.edf"
        events = eeg_dir / f"{sub}_task-Sleep_acq-psg_events.tsv"

        try:
            raw = mne.io.read_raw_edf(edf, preload=True, verbose="ERROR")
            raw.filter(0.5, 30.0, verbose="ERROR")
        except Exception as e:
            print(f"[SKIP] {sub}: EDF read/filter failed: {type(e).__name__}: {e}")
            continue

        eeg_ch = pick_eeg_channels(raw)
        imu_ch = pick_imu_channels(raw)

        try:
            df = pd.read_csv(events, sep="	")
        except Exception as e:
            print(f"[SKIP] {sub}: events read failed: {type(e).__name__}: {e}")
            continue

        if not first_debug_printed:
            print(f"[DEBUG] first subject={sub}")
            print(f"[DEBUG] raw.ch_names={raw.ch_names}")
            print(f"[DEBUG] eeg_ch={eeg_ch}")
            print(f"[DEBUG] imu_ch={imu_ch}")
            print(f"[DEBUG] events columns={df.columns.tolist()}")
            if "stage_hum" in df.columns:
                vals = df["stage_hum"].dropna().astype(str).unique().tolist()
                print(f"[DEBUG] stage_hum examples={vals[:20]}")
            first_debug_printed = True

        if len(eeg_ch) < 2 or len(imu_ch) < 3:
            print(f"[SKIP] {sub}: eeg_ch={eeg_ch}, imu_ch={imu_ch}, raw.ch_names={raw.ch_names}")
            continue

        raw.pick(eeg_ch + imu_ch)

        sfreq = raw.info["sfreq"]
        epoch_len = int(EPOCH_SEC * sfreq)

        subj_eeg = []
        subj_imu = []
        subj_y = []

        kept = 0
        dropped_label = 0
        dropped_bounds = 0

        for _, row in df.iterrows():
            label = normalize_stage(row["stage_hum"])
            if label not in STAGE_LABELS:
                dropped_label += 1
                continue

            start = int(float(row["onset"]) * sfreq)
            stop = start + epoch_len

            if stop > raw.n_times:
                dropped_bounds += 1
                continue

            seg = raw.get_data(start=start, stop=stop)

            eeg = seg[:2]
            imu = seg[2:].T

            if eeg.shape[0] != 2 or imu.shape[1] != 3:
                continue

            subj_eeg.append(eeg_features(eeg))
            subj_imu.append(imu_features(imu))
            subj_y.append(label)
            kept += 1

        if subj_eeg:
            subj_eeg = add_temporal_context(np.vstack(subj_eeg))
            subj_imu = np.vstack(subj_imu).astype(np.float32)

            X_eeg.extend(subj_eeg.tolist())
            X_imu.extend(subj_imu.tolist())
            y.extend(subj_y)
            groups.extend([sub] * len(subj_y))

        print(f"[LOAD] {sub}: kept={kept}, dropped_label={dropped_label}, dropped_bounds={dropped_bounds}")

    if not X_eeg or not X_imu:
        raise ValueError(
            "No multimodal samples were built. Check stage label normalization and whether "
            "headband EDFs actually expose HB_IMU channels in raw.ch_names."
        )

    return np.vstack(X_eeg), np.vstack(X_imu), np.array(y), np.array(groups)

# =============================
# Training
# =============================

def build_model():
    return Pipeline([
        ("imp", SimpleImputer(strategy="median")),
        ("clf", RandomForestClassifier(
            n_estimators=300,
            max_depth=None,
            min_samples_leaf=2,
            class_weight="balanced_subsample",
            random_state=42,
            n_jobs=-1,
        )),
    ])


def main():
    ds_root = Path.home() / "datasets" / "ds005555"
    out_dir = Path("artifacts_openneuro_lopo_v4")
    out_dir.mkdir(parents=True, exist_ok=True)

    X_eeg, X_imu, y, groups = load_multimodal(ds_root)

    unique_subjects = np.unique(groups)
    print(f"[INFO] unique subjects used={len(unique_subjects)}")
    print(f"[INFO] first subjects={unique_subjects[:10].tolist()}")
    print(f"[INFO] X_eeg shape={X_eeg.shape}")
    print(f"[INFO] X_imu shape={X_imu.shape}")
    print(f"[INFO] label counts={pd.Series(y).value_counts().to_dict()}")
    print("[INFO] stage model=RandomForestClassifier on EEG features")
    print("[INFO] fused model=RandomForestClassifier on concatenated EEG+IMU features")
    print("[INFO] fusion=weighted probability averaging (EEG + fused), no gate, no Viterbi")

    logo = LeaveOneGroupOut()

    all_y_true = []
    all_stage_pred = []
    all_fusion_pred = []
    fold_rows = []

    for fold_idx, (train_idx, test_idx) in enumerate(logo.split(X_eeg, y, groups), start=1):
        X_eeg_tr, X_eeg_te = X_eeg[train_idx], X_eeg[test_idx]
        X_imu_tr, X_imu_te = X_imu[train_idx], X_imu[test_idx]
        y_tr, y_te = y[train_idx], y[test_idx]
        held_out_subject = groups[test_idx][0]

        stage_model = build_model()
        fused_model = build_model()

        X_fused_tr = np.hstack([X_eeg_tr, X_imu_tr])
        X_fused_te = np.hstack([X_eeg_te, X_imu_te])

        X_eeg_tr_bal, y_tr_bal = oversample_n1_n3(X_eeg_tr, y_tr, target_frac=0.6, random_state=42 + fold_idx)
        X_fused_tr_bal, y_tr_bal_fused = oversample_n1_n3(X_fused_tr, y_tr, target_frac=0.6, random_state=142 + fold_idx)

        print(f"[FOLD {fold_idx:02d}] {held_out_subject}: train_eeg={X_eeg_tr.shape} -> {X_eeg_tr_bal.shape}, train_fused={X_fused_tr.shape} -> {X_fused_tr_bal.shape}")

        stage_model.fit(X_eeg_tr_bal, y_tr_bal)
        fused_model.fit(X_fused_tr_bal, y_tr_bal_fused)

        stage_pred = stage_model.predict(X_eeg_te)
        fusion_pred = fused_model.predict(X_fused_te)

        stage_proba = stage_model.predict_proba(X_eeg_te)
        fused_proba = fused_model.predict_proba(X_fused_te)

        classes = stage_model.named_steps["clf"].classes_
        class_to_idx = {c: i for i, c in enumerate(classes)}
        fusion_weights = {"Wake": 0.35, "N1": 0.50, "N2": 0.35, "N3": 0.50, "REM": 0.40}
        avg_proba = np.zeros_like(stage_proba, dtype=float)
        for cls, idx in class_to_idx.items():
            w = fusion_weights.get(cls, 0.40)
            avg_proba[:, idx] = (1.0 - w) * stage_proba[:, idx] + w * fused_proba[:, idx]
        hybrid_pred = classes[np.argmax(avg_proba, axis=1)]

        fold_row = {
            "fold": fold_idx,
            "held_out_subject": held_out_subject,
            "n_epochs": int(len(test_idx)),
            "stage_acc": float(accuracy_score(y_te, stage_pred)),
            "stage_macro_f1": float(f1_score(y_te, stage_pred, average="macro", zero_division=0)),
            "stage_bal_acc": float(balanced_accuracy_score(y_te, stage_pred)),
            "fusion_acc": float(accuracy_score(y_te, hybrid_pred)),
            "fusion_macro_f1": float(f1_score(y_te, hybrid_pred, average="macro", zero_division=0)),
            "fusion_bal_acc": float(balanced_accuracy_score(y_te, hybrid_pred)),
        }
        fold_rows.append(fold_row)

        all_y_true.extend(y_te.tolist())
        all_stage_pred.extend(stage_pred.tolist())
        all_fusion_pred.extend(hybrid_pred)
        print(
            f"[FOLD {fold_idx:02d}] {held_out_subject}: n={len(test_idx)} "
            f"stage_f1={fold_row['stage_macro_f1']:.4f} "
            f"hybrid_f1={fold_row['fusion_macro_f1']:.4f}"
        )

    fold_df = pd.DataFrame(fold_rows)
    fold_df.to_csv(out_dir / "lopo_fold_metrics.csv", index=False)

    summary = {
        "n_subjects": int(len(unique_subjects)),
        "n_epochs": int(len(all_y_true)),
        "stage_accuracy": float(accuracy_score(all_y_true, all_stage_pred)),
        "stage_macro_f1": float(f1_score(all_y_true, all_stage_pred, average="macro", zero_division=0)),
        "stage_balanced_accuracy": float(balanced_accuracy_score(all_y_true, all_stage_pred)),
        "fusion_accuracy": float(accuracy_score(all_y_true, all_fusion_pred)),
        "fusion_macro_f1": float(f1_score(all_y_true, all_fusion_pred, average="macro", zero_division=0)),
        "fusion_balanced_accuracy": float(balanced_accuracy_score(all_y_true, all_fusion_pred)),
        "fusion_better_folds": int((fold_df["fusion_macro_f1"] > fold_df["stage_macro_f1"]).sum()),
        "equal_folds": int((fold_df["fusion_macro_f1"] == fold_df["stage_macro_f1"]).sum()),
        "stage_confusion_matrix": confusion_matrix(all_y_true, all_stage_pred, labels=STAGE_LABELS).tolist(),
        "fusion_confusion_matrix": confusion_matrix(all_y_true, all_fusion_pred, labels=STAGE_LABELS).tolist(),
        "stage_classification_report": classification_report(
            all_y_true,
            all_stage_pred,
            labels=STAGE_LABELS,
            output_dict=True,
            zero_division=0,
        ),
        "fusion_classification_report": classification_report(
            all_y_true,
            all_fusion_pred,
            labels=STAGE_LABELS,
            output_dict=True,
            zero_division=0,
        ),
    }

    with open(out_dir / "lopo_summary.json", "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)

    print("=== OVERALL RESULTS ===")
    print(f"Subjects: {summary['n_subjects']}")
    print(f"Epochs: {summary['n_epochs']}")
    print(f"Stage accuracy: {summary['stage_accuracy']:.4f}")
    print(f"Stage macro F1: {summary['stage_macro_f1']:.4f}")
    print(f"Stage balanced accuracy: {summary['stage_balanced_accuracy']:.4f}")
    print(f"Fusion accuracy: {summary['fusion_accuracy']:.4f}")
    print(f"Fusion macro F1: {summary['fusion_macro_f1']:.4f}")
    print(f"Fusion balanced accuracy: {summary['fusion_balanced_accuracy']:.4f}")
    print(f"Fusion better on folds: {summary['fusion_better_folds']} / {len(fold_df)}")
    print(f"Saved fold metrics to: {out_dir / 'lopo_fold_metrics.csv'}")
    print(f"Saved summary to: {out_dir / 'lopo_summary.json'}")


if __name__ == "__main__":
    main()