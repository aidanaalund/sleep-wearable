#This script will 


from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable, List, Optional, Sequence, Tuple

import numpy as np
import pandas as pd
from sklearn.base import clone
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier


# -----------------------------------------------------------------------------
# IMU epoching and feature extraction
# -----------------------------------------------------------------------------


def ensure_datetime_col(df: pd.DataFrame, time_col: str) -> pd.DataFrame:
    """Return a copy with a proper datetime column."""
    out = df.copy()
    out[time_col] = pd.to_datetime(out[time_col])
    out = out.sort_values(time_col).reset_index(drop=True)
    return out



def add_acc_magnitude(df: pd.DataFrame, x_col: str, y_col: str, z_col: str) -> pd.DataFrame:
    """Add acceleration magnitude column."""
    out = df.copy()
    out["acc_mag"] = np.sqrt(out[x_col] ** 2 + out[y_col] ** 2 + out[z_col] ** 2)
    return out



def epoch_imu_non_overlapping(
    imu_df: pd.DataFrame,
    time_col: str,
    x_col: str,
    y_col: str,
    z_col: str,
    epoch_seconds: int = 30,
    movement_threshold: Optional[float] = None,
) -> pd.DataFrame:
    """
    Convert raw IMU samples into non-overlapping fixed-length epochs.

    Returns one row per epoch with engineered features.
    """
    df = ensure_datetime_col(imu_df, time_col)
    df = add_acc_magnitude(df, x_col, y_col, z_col)

    t0 = df[time_col].iloc[0]
    elapsed_sec = (df[time_col] - t0).dt.total_seconds()
    df["epoch_idx"] = (elapsed_sec // epoch_seconds).astype(int)

    # Estimate baseline gravitational magnitude if threshold not provided.
    if movement_threshold is None:
        # Roughly use median-centered dynamic magnitude threshold.
        med_mag = df["acc_mag"].median()
        dyn_mag = np.abs(df["acc_mag"] - med_mag)
        movement_threshold = float(np.percentile(dyn_mag, 75))

    rows: List[dict] = []
    for epoch_idx, g in df.groupby("epoch_idx", sort=True):
        start_time = g[time_col].iloc[0]
        end_time = start_time + pd.Timedelta(seconds=epoch_seconds)

        mag = g["acc_mag"].to_numpy(dtype=float)
        x = g[x_col].to_numpy(dtype=float)
        y = g[y_col].to_numpy(dtype=float)
        z = g[z_col].to_numpy(dtype=float)

        med_mag = np.median(mag)
        dyn_mag = np.abs(mag - med_mag)

        row = {
            "epoch_idx": int(epoch_idx),
            "epoch_start": start_time,
            "epoch_end": end_time,
            "n_samples": int(len(g)),
            # Magnitude-based features
            "mag_mean": float(np.mean(mag)),
            "mag_std": float(np.std(mag)),
            "mag_min": float(np.min(mag)),
            "mag_max": float(np.max(mag)),
            "mag_range": float(np.max(mag) - np.min(mag)),
            "mag_median": float(np.median(mag)),
            "mag_q25": float(np.percentile(mag, 25)),
            "mag_q75": float(np.percentile(mag, 75)),
            # Dynamic movement features
            "dyn_mean": float(np.mean(dyn_mag)),
            "dyn_std": float(np.std(dyn_mag)),
            "dyn_energy": float(np.sum(dyn_mag ** 2)),
            "pct_moving": float(np.mean(dyn_mag > movement_threshold)),
            # Axis features
            "x_mean": float(np.mean(x)),
            "x_std": float(np.std(x)),
            "y_mean": float(np.mean(y)),
            "y_std": float(np.std(y)),
            "z_mean": float(np.mean(z)),
            "z_std": float(np.std(z)),
        }
        rows.append(row)

    return pd.DataFrame(rows)



def default_imu_feature_columns(epoch_df: pd.DataFrame) -> List[str]:
    """Feature columns created by epoch_imu_non_overlapping()."""
    meta_cols = {"epoch_idx", "epoch_start", "epoch_end", "n_samples", "label_sleep", "label_stage"}
    return [c for c in epoch_df.columns if c not in meta_cols]


# -----------------------------------------------------------------------------
# Models
# -----------------------------------------------------------------------------


def build_default_imu_model(random_state: int = 42) -> Pipeline:
    """Binary classifier for sleep(1) vs wake(0) from IMU features."""
    return Pipeline(
        steps=[
            ("scaler", StandardScaler()),
            (
                "clf",
                LogisticRegression(
                    max_iter=2000,
                    class_weight="balanced",
                    random_state=random_state,
                ),
            ),
        ]
    )



def build_default_meta_model(random_state: int = 42) -> Pipeline:
    """Fusion meta-model that consumes EEG probabilities + IMU sleep probability."""
    return Pipeline(
        steps=[
            ("scaler", StandardScaler()),
            (
                "clf",
                LogisticRegression(
                    max_iter=2000,
                    multi_class="auto",
                    class_weight="balanced",
                    random_state=random_state,
                ),
            ),
        ]
    )


# -----------------------------------------------------------------------------
# Fusion logic
# -----------------------------------------------------------------------------


@dataclass
class RuleFusionConfig:
    wake_class: int = 0
    n1_class: int = 1
    confidence_margin: float = 0.15
    imu_sleep_low: float = 0.40
    imu_sleep_high: float = 0.60



def rule_based_wake_n1_fusion(
    eeg_proba: np.ndarray,
    imu_sleep_proba: np.ndarray,
    config: RuleFusionConfig | None = None,
) -> np.ndarray:
    """
    Fuse EEG multiclass probabilities with IMU sleep probabilities.

    Strategy:
    - Start with EEG argmax
    - Only intervene when EEG is ambiguous between Wake and N1
    - Use IMU to push the decision toward Wake or N1
    - Leave N2/N3/REM untouched unless EEG itself predicted Wake/N1 ambiguously
    """
    cfg = config or RuleFusionConfig()

    eeg_proba = np.asarray(eeg_proba, dtype=float)
    imu_sleep_proba = np.asarray(imu_sleep_proba, dtype=float).reshape(-1)

    if eeg_proba.ndim != 2:
        raise ValueError("eeg_proba must be shape (n_samples, n_classes)")
    if len(imu_sleep_proba) != len(eeg_proba):
        raise ValueError("imu_sleep_proba length must match eeg_proba rows")
    if eeg_proba.shape[1] < 2:
        raise ValueError("Need at least two EEG classes for Wake/N1 fusion")

    final_pred = np.argmax(eeg_proba, axis=1).astype(int)

    wake_p = eeg_proba[:, cfg.wake_class]
    n1_p = eeg_proba[:, cfg.n1_class]
    wake_n1_margin = np.abs(wake_p - n1_p)

    # Intervene when Wake and N1 are close and at least one is the chosen class.
    ambiguous = wake_n1_margin < cfg.confidence_margin
    predicted_wake_or_n1 = np.isin(final_pred, [cfg.wake_class, cfg.n1_class])
    intervene = ambiguous & predicted_wake_or_n1

    force_n1 = intervene & (imu_sleep_proba >= cfg.imu_sleep_high)
    force_wake = intervene & (imu_sleep_proba <= cfg.imu_sleep_low)

    final_pred[force_n1] = cfg.n1_class
    final_pred[force_wake] = cfg.wake_class

    return final_pred



def build_meta_features(eeg_proba: np.ndarray, imu_sleep_proba: np.ndarray) -> np.ndarray:
    """Concatenate EEG class probabilities with IMU sleep probability."""
    eeg_proba = np.asarray(eeg_proba, dtype=float)
    imu_sleep_proba = np.asarray(imu_sleep_proba, dtype=float).reshape(-1, 1)

    if len(eeg_proba) != len(imu_sleep_proba):
        raise ValueError("Lengths must match")
    return np.hstack([eeg_proba, imu_sleep_proba])


# -----------------------------------------------------------------------------
# Alignment helpers
# -----------------------------------------------------------------------------



def align_eeg_and_imu_epochs(
    eeg_df: pd.DataFrame,
    imu_epoch_df: pd.DataFrame,
    eeg_start_col: str = "epoch_start",
    imu_start_col: str = "epoch_start",
    tolerance: str = "1s",
) -> pd.DataFrame:
    """
    Align EEG epochs with IMU epochs by nearest epoch start time.

    This assumes both are already on roughly the same 30 s cadence.
    """
    eeg = eeg_df.copy().sort_values(eeg_start_col)
    imu = imu_epoch_df.copy().sort_values(imu_start_col)

    eeg[eeg_start_col] = pd.to_datetime(eeg[eeg_start_col])
    imu[imu_start_col] = pd.to_datetime(imu[imu_start_col])

    merged = pd.merge_asof(
        eeg,
        imu,
        left_on=eeg_start_col,
        right_on=imu_start_col,
        direction="nearest",
        tolerance=pd.Timedelta(tolerance),
        suffixes=("_eeg", "_imu"),
    )
    return merged


# -----------------------------------------------------------------------------
# Example training/evaluation utilities
# -----------------------------------------------------------------------------



def train_imu_model(
    imu_epoch_df: pd.DataFrame,
    label_col: str = "label_sleep",
    feature_cols: Optional[Sequence[str]] = None,
    model: Optional[Pipeline] = None,
    test_size: float = 0.2,
    random_state: int = 42,
):
    """Train and evaluate binary IMU sleep model."""
    if feature_cols is None:
        feature_cols = default_imu_feature_columns(imu_epoch_df)
    if model is None:
        model = build_default_imu_model(random_state=random_state)

    X = imu_epoch_df[list(feature_cols)].to_numpy(dtype=float)
    y = imu_epoch_df[label_col].to_numpy(dtype=int)

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=test_size,
        random_state=random_state,
        stratify=y,
    )

    fitted = clone(model)
    fitted.fit(X_train, y_train)

    y_pred = fitted.predict(X_test)
    y_proba = fitted.predict_proba(X_test)[:, 1]

    metrics = {
        "accuracy": accuracy_score(y_test, y_pred),
        "classification_report": classification_report(y_test, y_pred, output_dict=False),
        "confusion_matrix": confusion_matrix(y_test, y_pred),
    }
    return fitted, metrics, (X_train, X_test, y_train, y_test, y_proba)



def evaluate_rule_fusion(
    y_true_stage: np.ndarray,
    eeg_proba: np.ndarray,
    imu_sleep_proba: np.ndarray,
    config: RuleFusionConfig | None = None,
) -> dict:
    """Evaluate rule-based fusion."""
    y_true_stage = np.asarray(y_true_stage, dtype=int)
    y_pred = rule_based_wake_n1_fusion(eeg_proba, imu_sleep_proba, config=config)
    return {
        "accuracy": accuracy_score(y_true_stage, y_pred),
        "classification_report": classification_report(y_true_stage, y_pred, output_dict=False),
        "confusion_matrix": confusion_matrix(y_true_stage, y_pred),
        "y_pred": y_pred,
    }



def train_stacked_fusion(
    y_true_stage: np.ndarray,
    eeg_proba: np.ndarray,
    imu_sleep_proba: np.ndarray,
    meta_model: Optional[Pipeline] = None,
    test_size: float = 0.2,
    random_state: int = 42,
):
    """Train and evaluate a stacked fusion classifier."""
    X_meta = build_meta_features(eeg_proba, imu_sleep_proba)
    y = np.asarray(y_true_stage, dtype=int)

    if meta_model is None:
        meta_model = build_default_meta_model(random_state=random_state)

    X_train, X_test, y_train, y_test = train_test_split(
        X_meta,
        y,
        test_size=test_size,
        random_state=random_state,
        stratify=y,
    )

    fitted = clone(meta_model)
    fitted.fit(X_train, y_train)
    y_pred = fitted.predict(X_test)

    metrics = {
        "accuracy": accuracy_score(y_test, y_pred),
        "classification_report": classification_report(y_test, y_pred, output_dict=False),
        "confusion_matrix": confusion_matrix(y_test, y_pred),
    }
    return fitted, metrics, (X_train, X_test, y_train, y_test, y_pred)


def example_usage() -> None:
    """
    Sketch of the intended workflow.

    Replace the placeholders with your real arrays / dataframes.
    """
    imu_raw = pd.DataFrame(
        {
            "timestamp": pd.date_range("2026-01-01 00:00:00", periods=3000, freq="1s"),
            "ax": np.random.randn(3000),
            "ay": np.random.randn(3000),
            "az": 1 + 0.05 * np.random.randn(3000),
        }
    )

    imu_epochs = epoch_imu_non_overlapping(
        imu_raw,
        time_col="timestamp",
        x_col="ax",
        y_col="ay",
        z_col="az",
        epoch_seconds=30,
    )

    # Add your binary labels here if training IMU model from scratch.
    # 0 = awake, 1 = sleep
    imu_epochs["label_sleep"] = np.random.randint(0, 2, size=len(imu_epochs))

    imu_model, imu_metrics, _ = train_imu_model(imu_epochs)
    print("IMU model accuracy:", imu_metrics["accuracy"])

    imu_feature_cols = default_imu_feature_columns(imu_epochs)
    imu_sleep_proba = imu_model.predict_proba(imu_epochs[imu_feature_cols])[:, 1]

    # ------------------------------------------------------------------
    # 2) EEG model outputs (you already have/will have these)
    # ------------------------------------------------------------------
    n = len(imu_epochs)
    # Fake 5-class EEG probabilities for illustration only.
    eeg_proba = np.random.dirichlet(alpha=np.ones(5), size=n)
    y_stage = np.random.randint(0, 5, size=n)

    # ------------------------------------------------------------------
    # 3) Rule-based Wake/N1 fusion
    # ------------------------------------------------------------------
    rule_results = evaluate_rule_fusion(y_stage, eeg_proba, imu_sleep_proba)
    print("Rule fusion accuracy:", rule_results["accuracy"])

    # ------------------------------------------------------------------
    # 4) Stacked fusion
    # ------------------------------------------------------------------
    meta_model, meta_metrics, _ = train_stacked_fusion(y_stage, eeg_proba, imu_sleep_proba)
    print("Stacked fusion accuracy:", meta_metrics["accuracy"])


if __name__ == "__main__":
    example_usage()
