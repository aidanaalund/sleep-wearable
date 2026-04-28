#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import joblib
import mne
from scipy.signal import welch
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline

STAGE_LABELS = ["Wake", "N1", "N2", "N3", "REM"]


def ensure_dir(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def load_summary(artifacts: Path) -> dict:
    with open(artifacts / "lopo_summary.json", "r", encoding="utf-8") as f:
        return json.load(f)


def save_accuracy_tile(value: float, title: str, out_path: Path) -> None:
    fig, ax = plt.subplots(figsize=(4, 3))
    ax.axis("off")
    ax.text(0.5, 0.62, f"{value:.1%}", ha="center", va="center", fontsize=34, fontweight="bold")
    ax.text(0.5, 0.27, title, ha="center", va="center", fontsize=14)
    plt.tight_layout()
    fig.savefig(out_path, dpi=300, bbox_inches="tight")
    plt.close(fig)


def plot_confusion_matrix(ax, cm: np.ndarray, labels: list[str], title: str):
    row_sums = cm.sum(axis=1, keepdims=True)
    cm_norm = np.divide(cm, row_sums, out=np.zeros_like(cm, dtype=float), where=row_sums != 0)
    im = ax.imshow(cm_norm, vmin=0, vmax=1)
    ax.set_title(title)
    ax.set_xticks(np.arange(len(labels)))
    ax.set_yticks(np.arange(len(labels)))
    ax.set_xticklabels(labels, rotation=45, ha="right")
    ax.set_yticklabels(labels)
    ax.set_xlabel("predicted")
    ax.set_ylabel("true")
    for i in range(cm_norm.shape[0]):
        for j in range(cm_norm.shape[1]):
            val = cm_norm[i, j]
            ax.text(j, i, f"{val:.2f}", ha="center", va="center",
                    color="white" if val > 0.5 else "black", fontsize=9)
    return im


def make_confusion_figures(artifacts: Path, outdir: Path):
    summary = load_summary(artifacts)
    stage_cm = np.array(summary["stage_confusion_matrix"], dtype=float)
    fusion_cm = np.array(summary["fusion_confusion_matrix"], dtype=float)

    fig, axes = plt.subplots(1, 2, figsize=(12, 5))
    im = plot_confusion_matrix(axes[0], stage_cm, STAGE_LABELS, "eeg only")
    plot_confusion_matrix(axes[1], fusion_cm, STAGE_LABELS, STAGE_LABELS and "with imu")
    fig.colorbar(im, ax=axes.ravel().tolist(), fraction=0.03, pad=0.04)
    plt.tight_layout()
    fig.savefig(outdir / "01_confusion_before_after_imu.png", dpi=300, bbox_inches="tight")
    plt.close(fig)

    save_accuracy_tile(np.trace(stage_cm) / stage_cm.sum(), "eeg accuracy", outdir / "01a_accuracy_eeg_only.png")
    save_accuracy_tile(np.trace(fusion_cm) / fusion_cm.sum(), "fusion accuracy", outdir / "01b_accuracy_fusion.png")


def _build_model() -> Pipeline:
    return Pipeline([
        ("imp", SimpleImputer(strategy="median")),
        ("clf", RandomForestClassifier(
            n_estimators=300,
            min_samples_leaf=2,
            class_weight="balanced_subsample",
            random_state=42,
            n_jobs=-1,
        )),
    ])


def _base_eeg_names() -> list[str]:
    names = []
    channels = ["ch0", "ch1"]
    bands = ["delta", "theta", "alpha", "sigma", "beta"]
    extra_bands = ["so", "narrow_theta", "spindle_band"]
    for ch in channels:
        for b in bands:
            names += [f"{ch}_{b}_log", f"{ch}_{b}_rel"]
        for b in extra_bands:
            names += [f"{ch}_{b}_log", f"{ch}_{b}_rel"]
        names += [
            f"{ch}_so_over_beta", f"{ch}_beta_over_delta",
            f"{ch}_theta_over_alpha", f"{ch}_sigma_over_theta",
            f"{ch}_frontal_theta_fraction",
            f"{ch}_spectral_slope",
            f"{ch}_hjorth_activity", f"{ch}_hjorth_mobility", f"{ch}_hjorth_complexity",
            f"{ch}_spectral_entropy",
            f"{ch}_lz_complexity",
            f"{ch}_line_length", f"{ch}_kurtosis", f"{ch}_skew",
            f"{ch}_rms", f"{ch}_ptp", f"{ch}_zcr",
            f"{ch}_peak_freq", f"{ch}_sef",
            f"{ch}_delta_kurtosis",
            f"{ch}_alpha_peak_freq",
            f"{ch}_so_amp_peak", f"{ch}_so_amp_p90",
            f"{ch}_alpha_over_beta", f"{ch}_delta_over_sigma",
            f"{ch}_sigma_over_theta_delta",
        ]
    names += ["delta_coherence", "theta_coherence",
              "alpha_asymmetry", "delta_asymmetry", "sigma_asymmetry"]
    return names


def _base_imu_names() -> list[str]:
    names = [
        "imu_any_movement",
        "imu_mean_mag", "imu_std_mag", "imu_var_mag",
        "imu_peak_amp", "imu_p95",
        "imu_n_events",
        "imu_mean_jerk", "imu_std_jerk", "imu_peak_jerk",
        "imu_resp_band_pwr", "imu_move_band_pwr", "imu_dom_freq",
        "imu_resp_power", "imu_resp_irregularity",
    ]
    for ax in range(3):
        names += [f"imu_std_ax{ax}", f"imu_rms_ax{ax}"]
    return names


def _temporal_names(base: list[str], n_total: int) -> list[str]:
    n_frames = n_total // len(base)
    remainder = n_total % len(base)
    out = []
    offsets = list(range(-(n_frames // 2), n_frames // 2 + 1))[:n_frames]
    for i, off in enumerate(offsets):
        tag = f"t{off:+d}" if off != 0 else "t0"
        out += [f"{tag}_{n}" for n in base]
    # pad any remainder (e.g. gradient features) with generic names
    for k in range(remainder):
        out.append(f"grad_{base[k % len(base)]}")
    return out


def load_model_and_feature_names(artifacts: Path, eeg_only_importance: bool):
    cache = Path(__file__).parent / "feature_cache.npz"
    if not cache.exists():
        raise FileNotFoundError(
            f"feature_cache.npz not found at {cache}. "
            "Run the 'Load Data' cell in tests/boas_final.ipynb to generate it."
        )

    print(f"[INFO] Loading feature cache from {cache} ...")
    d = np.load(cache, allow_pickle=True)
    X_eeg = d["X_eeg"].astype(np.float32)
    X_imu = d["X_imu"].astype(np.float32)
    y = d["y"]
    print(f"[INFO] X_eeg={X_eeg.shape}, X_imu={X_imu.shape}, epochs={len(y)}")

    base_eeg = _base_eeg_names()
    base_imu = _base_imu_names()

    if eeg_only_importance:
        X = X_eeg
        feature_names = _temporal_names(base_eeg, X_eeg.shape[1])
    else:
        X = np.hstack([X_eeg, X_imu])
        feature_names = (
            _temporal_names(base_eeg, X_eeg.shape[1])
            + _temporal_names(base_imu, X_imu.shape[1])
        )

    print(f"[INFO] Training fused model on {X.shape} ({len(np.unique(y))} classes) ...")
    model = _build_model()
    model.fit(X, y)
    print("[INFO] Training complete.")
    return model, feature_names


def feature_group_name(name: str) -> str:
    s = name.lower()
    # Temporal gradient features (from add_temporal_context)
    if s.startswith("grad_") or "gradient" in s:
        return "temporal gradient"
    # Cross-channel features: coherence and hemispheric asymmetry
    if any(k in s for k in ["coherence", "coh", "asymmetry", "asym", "corr", "diff"]):
        return "cross channel"
    # Hjorth parameters
    if "hjorth" in s:
        return "hjorth params"
    # Spectral stats: slope, entropy, edge/peak frequencies, spindle density
    if any(k in s for k in ["peak_freq", "sef95", "sef", "spectral_entropy", "psd_total",
                             "slope", "spindle_density", "alpha_peak", "edge_freq"]):
        return "spectral stats"
    # Band ratios: any feature that divides bands (over keyword, fraction, ratio)
    if any(b in s for b in ["delta", "theta", "alpha", "sigma", "beta", "so_", "_so"]):
        if any(k in s for k in ["over", "fraction", "ratio", "div"]):
            return "band ratios"
        return "band power"
    # Slow-wave / LFO amplitude features
    if any(k in s for k in ["slow_wave", "slow_amp", "so_amp", "sw_amp"]):
        return "time domain stats"
    # LZ / complexity
    if any(k in s for k in ["lempel", "lempel_ziv", "lz_", "complexity"]):
        return "complexity"
    # Time-domain stats
    if any(k in s for k in ["mean", "std", "var", "median", "iqr", "rms", "ptp", "skew",
                             "kurtosis", "zcr", "line_length", "jerk", "amplitude",
                             "peak_amp", "p90", "p95"]):
        return "time domain stats"
    return "other"


def make_feature_importance_figure(artifacts: Path, outdir: Path, eeg_only_importance: bool):
    model, feature_names = load_model_and_feature_names(artifacts, eeg_only_importance)
    rf = model.named_steps["clf"]
    importances = np.asarray(rf.feature_importances_, dtype=float)

    # Top-10 raw feature importances
    idx = np.argsort(importances)[-10:][::-1]
    top_names = [feature_names[i] for i in idx]
    top_vals = importances[idx]

    fig, ax = plt.subplots(figsize=(9, 5))
    ax.barh(top_names[::-1], top_vals[::-1])
    ax.set_xlabel("importance")
    ax.set_title("top 10 feature importances")
    ax.spines[['top', 'right']].set_visible(False)
    plt.tight_layout()
    fig.savefig(outdir / "02_feature_importance_top10.png", dpi=300, bbox_inches="tight")
    plt.close(fig)

    # Grouped feature importances
    grouped = {}
    for name, val in zip(feature_names, importances):
        key = feature_group_name(name)
        grouped[key] = grouped.get(key, 0.0) + float(val)

    items = sorted(grouped.items(), key=lambda x: x[1], reverse=True)

    labels = [k for k, _ in items]
    values = np.array([v for _, v in items], dtype=float)

    # Normalize for readability
    values = values / (values.sum() + 1e-12)

    # Reverse for clean top-to-bottom ranking in barh
    labels = labels[::-1]
    values = values[::-1]

    color_map = {
        "time domain stats": "#d193bb",
        "band power": "#baa5ff",
        "band ratios": "#bb719b",
        "spectral stats": "#05c0a6",
        "hjorth params": "#73d379",
        "cross channel": "#043a33",
        "complexity": "#7acef5",
        "temporal gradient": "#549eff",
        "other": "#1c3847",
    }
    colors = [color_map.get(label, "#7f7f7f") for label in labels]

    # 👇 Convert labels ONLY for display
    display_labels = [label.title() for label in labels]

    fig, ax = plt.subplots(figsize=(6.5, 6.5))
    ax.barh(display_labels, values, color=colors)

    ax.set_xlabel("Proportion of Total Importance", fontsize=12)
    ax.set_title("Feature Group Importance", fontsize=14)
    ax.spines[['top', 'right', 'left']].set_visible(False)
    ax.tick_params(axis='y', labelsize=11)
    ax.tick_params(axis='x', labelsize=10)

    for i, v in enumerate(values):
        if v is "Other":
            v = "Other (inertial)"
        ax.text(v + 0.005, i, f"{v:.2f}", va="center", fontsize=10)

    ax.set_xlim(0, max(values) * 1.18 if len(values) else 1.0)

    plt.tight_layout()
    fig.savefig(outdir / "02a_feature_group_importance.png", dpi=300, bbox_inches="tight")
    plt.close(fig)


def contiguous_transition_pairs(stages: np.ndarray):
    return list(zip(stages[:-1], stages[1:]))


def make_transition_heatmap(artifacts: Path, outdir: Path, pair: tuple[str, str], pred_col: str):
    df = pd.read_csv(artifacts / "epoch_predictions.csv")
    pair_labels = [(a, b) for a in pair for b in pair]

    true_pairs = []
    pred_pairs = []

    for _, sub_df in df.groupby("subject"):
        sub_df = sub_df.sort_values(["fold", "test_row_index", "global_row_index"])
        true_seq = sub_df["true_stage"].to_numpy()
        pred_seq = sub_df[pred_col].to_numpy()
        for t_pair, p_pair in zip(contiguous_transition_pairs(true_seq), contiguous_transition_pairs(pred_seq)):
            if t_pair[0] in pair and t_pair[1] in pair:
                true_pairs.append(t_pair)
                pred_pairs.append(p_pair)

    label_to_idx = {p: i for i, p in enumerate(pair_labels)}
    cm = np.zeros((len(pair_labels), len(pair_labels)), dtype=float)
    for tp, pp in zip(true_pairs, pred_pairs):
        if pp in label_to_idx:
            cm[label_to_idx[tp], label_to_idx[pp]] += 1

    row_sums = cm.sum(axis=1, keepdims=True)
    cm_norm = np.divide(cm, row_sums, out=np.zeros_like(cm), where=row_sums != 0)
    acc = float(np.trace(cm) / cm.sum()) if cm.sum() > 0 else 0.0

    labs = [f"{a}→{b}" for a, b in pair_labels]
    fig, ax = plt.subplots(figsize=(7, 6))
    im = ax.imshow(cm_norm, vmin=0, vmax=1)
    ax.set_xticks(np.arange(len(labs)))
    ax.set_yticks(np.arange(len(labs)))
    ax.set_xticklabels(labs, rotation=45, ha="right")
    ax.set_yticklabels(labs)
    ax.set_xlabel("predicted transition")
    ax.set_ylabel("true transition")
    ax.set_title(f"transition heatmap: {pair[0]} and {pair[1]}")
    for i in range(cm_norm.shape[0]):
        for j in range(cm_norm.shape[1]):
            val = cm_norm[i, j]
            ax.text(j, i, f"{val:.2f}", ha="center", va="center",
                    color="white" if val > 0.5 else "black", fontsize=9)
    fig.colorbar(im, ax=ax, fraction=0.04, pad=0.04)
    plt.tight_layout()
    fig.savefig(outdir / f"03_transition_heatmap_{pair[0]}_{pair[1]}.png", dpi=300, bbox_inches="tight")
    plt.close(fig)

    save_accuracy_tile(acc, f"{pair[0]} / {pair[1]} transition accuracy",
                       outdir / f"03a_transition_accuracy_{pair[0]}_{pair[1]}.png")


def stage_wave(stage: str, n: int = 900) -> np.ndarray:
    x = np.linspace(0, 3, n)  # 3 seconds
    rng = np.random.default_rng(abs(hash(stage)) % (2**32))
    if stage == "Awake":
        # Dominant alpha rhythm (~10 Hz) with slight amplitude modulation + low-level beta
        alpha_env = 0.85 + 0.15 * np.sin(2 * np.pi * 0.45 * x)
        alpha = 0.18 * np.sin(2 * np.pi * 10.2 * x) * alpha_env
        beta = 0.04 * np.sin(2 * np.pi * 21 * x + 0.9)
        noise = 0.05 * rng.standard_normal(n)
        y = alpha + beta + noise
    elif stage == "N1":
        # Theta waves (5-6 Hz) replace alpha; alpha fades from onset
        theta_env = 0.75 + 0.25 * np.sin(2 * np.pi * 0.38 * x)
        theta = 0.16 * np.sin(2 * np.pi * 5.5 * x) * theta_env
        fading_alpha = 0.09 * np.sin(2 * np.pi * 9.5 * x) * np.exp(-1.8 * x)
        noise = 0.04 * rng.standard_normal(n)
        y = theta + fading_alpha + noise
    elif stage == "N2":
        # Background slow activity + prominent spindles + K-complex
        base = 0.06 * np.sin(2 * np.pi * 2.0 * x) + 0.025 * rng.standard_normal(n)
        # K-complex: sharp large negative deflection followed by slower positive wave
        k_neg = -0.65 * np.exp(-((x - 1.45) ** 2) / 0.002)
        k_pos = +0.32 * np.exp(-((x - 1.57) ** 2) / 0.006)
        k_complex = k_neg + k_pos
        # Sleep spindles: Gaussian-enveloped ~13 Hz burst, ~0.5 s duration
        # σ ≈ 0.22 s → half-second visible burst clearly distinguishable from background
        sp1_env = np.exp(-((x - 0.75) ** 2) / 0.048)
        spindle1 = sp1_env * np.sin(2 * np.pi * 13.2 * x) * 0.52
        sp2_env = np.exp(-((x - 2.35) ** 2) / 0.050)
        spindle2 = sp2_env * np.sin(2 * np.pi * 12.7 * x) * 0.46
        y = base + k_complex + spindle1 + spindle2
    elif stage == "N3":
        # High-amplitude slow waves (0.5-2 Hz) with inter-wave amplitude variation and noise
        slow = 0.55 * np.sin(2 * np.pi * 0.75 * x)
        harmonic = 0.14 * np.sin(2 * np.pi * 1.55 * x + 0.35)  # slight asymmetry
        # Amplitude varies across cycles — real N3 is not a perfect sinusoid
        amp_env = 0.68 + 0.32 * np.sin(2 * np.pi * 0.21 * x + 1.1)
        delta_fast = 0.09 * np.sin(2 * np.pi * 3.4 * x + 0.7)
        noise = 0.05 * rng.standard_normal(n)
        y = (slow + harmonic) * amp_env + delta_fast + noise
    elif stage == "REM":
        # Low-amplitude mixed frequency; theta (4-7 Hz) dominant, irregular amplitude
        theta = 0.13 * np.sin(2 * np.pi * 4.8 * x + 0.4)
        mixed = 0.07 * np.sin(2 * np.pi * 7.5 * x) + 0.04 * np.sin(2 * np.pi * 3.0 * x + 1.2)
        amp_var = 1.0 + 0.35 * np.sin(2 * np.pi * 1.3 * x + 0.6)
        noise = 0.07 * rng.standard_normal(n)
        y = (theta + mixed) * amp_var + noise
    else:
        y = np.zeros(n)
    return y


def make_stage_characteristics_figure(outdir: Path):
    stages = ["Awake", "N1", "N2", "N3", "REM"]
    bg = {
        "Awake": "#e8817f",
        "N1": "#c3727c",
        "N2": "#8d5273",
        "N3": "#5a336e",
        "REM": "#311f62",
    }
    line_colors = {
        "Awake": "#111111",
        "N1": "#111111",
        "N2": "#111111",
        "N3": "#111111",
        "REM": "#111111",
    }

    fig, axes = plt.subplots(len(stages), 1, figsize=(9, 6), sharex=True)
    fig.patch.set_facecolor("#f3f3f300")

    for ax, st in zip(axes, stages):
        ax.set_facecolor(bg[st])
        y = stage_wave(st)
        x = np.linspace(0, 1, len(y))
        y = y / (np.max(np.abs(y)) + 1e-8)
        ax.plot(x, y, color=line_colors[st], linewidth=1.5)
        ax.set_ylim(-1.25, 1.25)
        ax.set_yticks([])
        ax.set_xticks([])
        for spine in ax.spines.values():
            spine.set_visible(True)
        ax.text(0, 0.82, st, transform=ax.transAxes, fontsize=24,
                ha="left", va="center", color='white')

    # axes[0].text(-0.02, 0.83, "EEG Signal:", transform=axes[0].transAxes,
    #              ha="right", va="center", fontsize=24, fontweight="bold")

    plt.subplots_adjust(left=0.16, right=0.98, top=0.97, bottom=0.06, hspace=0.05)
    fig.savefig(outdir / "04_sleep_stage_characteristics.png", dpi=300, bbox_inches="tight")
    plt.close(fig)


def make_dataset_exploration_real(ds_root: Path, outdir: Path, subject: str = "sub-100", target_stage: str = "N2"):
    # optional extra real plot if user still wants it later
    edf = ds_root / subject / "eeg" / f"{subject}_task-Sleep_acq-headband_eeg.edf"
    events = ds_root / subject / "eeg" / f"{subject}_task-Sleep_acq-psg_events.tsv"
    if not edf.exists() or not events.exists():
        return

    def normalize_stage(label):
        text = str(label).strip().lower()
        mapping = {
            "0": "Wake", "wake": "Wake", "w": "Wake",
            "1": "N1", "n1": "N1", "nrem1": "N1", "sleep stage n1": "N1",
            "2": "N2", "n2": "N2", "nrem2": "N2", "sleep stage n2": "N2",
            "3": "N3", "n3": "N3", "nrem3": "N3", "sleep stage n3": "N3",
            "4": "REM", "rem": "REM", "r": "REM", "sleep stage r": "REM",
        }
        return mapping.get(text)

    raw = mne.io.read_raw_edf(edf, preload=True, verbose="ERROR")
    raw.filter(0.5, 30.0, verbose="ERROR")
    eeg_ch = [ch for ch in raw.ch_names if ch.lower() in ("hb_1", "hb_2")]
    if not eeg_ch:
        return
    raw.pick(eeg_ch[:1])

    df = pd.read_csv(events, sep="\t")
    df["norm_stage"] = df["stage_hum"].apply(normalize_stage)
    sub = df[df["norm_stage"] == target_stage]
    if sub.empty:
        return
    row = sub.iloc[0]
    sfreq = raw.info["sfreq"]
    start = int(float(row["onset"]) * sfreq)
    stop = start + int(30 * sfreq)
    x = raw.get_data(start=start, stop=stop)[0]
    t = np.arange(len(x)) / sfreq
    f, psd = welch(x, fs=sfreq, nperseg=min(512, len(x)))

    fig, axes = plt.subplots(2, 1, figsize=(10, 6))
    axes[0].plot(t, x, linewidth=1)
    axes[0].set_title(f"{subject} example eeg window ({target_stage})")
    axes[0].set_xlabel("time (s)")
    axes[0].set_ylabel("amplitude")

    axes[1].plot(f, psd, linewidth=1)
    axes[1].set_xlim(0, 30)
    axes[1].set_title("power spectral density")
    axes[1].set_xlabel("frequency (hz)")
    axes[1].set_ylabel("power")
    plt.tight_layout()
    fig.savefig(outdir / "04a_real_eeg_example_optional.png", dpi=300, bbox_inches="tight")
    plt.close(fig)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--artifacts", type=Path, required=True)
    parser.add_argument("--outdir", type=Path, required=True)
    parser.add_argument("--ds-root", type=Path, required=True)
    parser.add_argument("--pair", nargs=2, default=["N2", "N3"])
    parser.add_argument("--pred-col", default="fusion_pred", choices=["fusion_pred", "eeg_pred"])
    parser.add_argument("--eeg-only-importance", action="store_true")
    args = parser.parse_args()

    ensure_dir(args.outdir)
    # make_confusion_figures(args.artifacts, args.outdir)
    make_feature_importance_figure(args.artifacts, args.outdir, args.eeg_only_importance)
    # make_transition_heatmap(args.artifacts, args.outdir, (args.pair[0], args.pair[1]), args.pred_col)
    # make_stage_characteristics_figure(args.outdir)
    # optional real plot saved too if available
    # make_dataset_exploration_real(args.ds_root.expanduser(), args.outdir)

    print(f"saved visualizations to: {args.outdir}")


if __name__ == "__main__":
    main()
