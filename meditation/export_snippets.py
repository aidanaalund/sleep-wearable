"""Find a 30s meditation snippet and a 30s mind-wandering snippet from
ds001787, run the exported ONNX model on the last 10s (the deploy probe
context) to confirm ground truth, and emit a C header for embedded use.

Pre-processing matches the notebook's raw loader:
  - pick channels A1, B2, A2, B3, B1 (Fp1, Fp2, AF7, AF8, Fpz)
  - notch at 50/60 Hz
  - bandpass 0.5-40 Hz
  - bipolar derivation (Fp1-Fp2)-Fpz, (AF7-AF8)-Fpz
  - per-window z-score before inference (matches feature_schema_eegnet.json)
"""

from pathlib import Path
import json
import sys

import mne
import numpy as np
import onnxruntime as ort
import pandas as pd

mne.set_log_level("ERROR")

ROOT = Path(__file__).resolve().parent
DS_ROOT = ROOT / "dataset" / "ds001787"
ORT_PATH = ROOT / "artifacts" / "meditation_model_eegnet.ort"
SCHEMA = json.loads((ROOT / "artifacts" / "feature_schema_eegnet.json").read_text())

FS = int(SCHEMA["sampling_rate_hz"])           # 256
WIN = int(SCHEMA["window_sec"] * FS)            # 1280
SNIPPET_SEC = 30
SNIPPET_N = SNIPPET_SEC * FS                    # 7680
CONTEXT_SEC = 10
CONTEXT_N = CONTEXT_SEC * FS                    # 2560
STEP_SEC = 1.0                                  # matches notebook STEP_SEC -> 6 windows/probe
STEP_N = int(STEP_SEC * FS)                     # 256

PRIMARY = ["A1", "B2", "A2", "B3"]
REF = "B1"
LABEL_NAMES = {0: "meditation", 1: "mind_wandering"}
Q2_LABEL = {2: "meditation", 4: "mind_wandering", 8: "mind_wandering"}


def extract_probe_label(events_df: pd.DataFrame, probe_idx: int):
    responses = []
    for j in range(probe_idx + 1, len(events_df)):
        row = events_df.iloc[j]
        tt = str(row.get("trial_type", "")).strip().lower()
        val = row.get("value")
        if tt == "stimulus" and pd.notna(val) and int(val) == 128:
            break
        if tt == "response" and pd.notna(val) and int(val) in Q2_LABEL:
            responses.append(int(val))
        if len(responses) == 3:
            break
    if len(responses) < 2:
        return None
    return Q2_LABEL.get(responses[1])


def load_recording(eeg_path: Path):
    raw = mne.io.read_raw_bdf(eeg_path, preload=True, verbose="ERROR")
    if not all(c in raw.ch_names for c in PRIMARY + [REF]):
        return None
    raw.pick(PRIMARY + [REF])
    sfreq = float(raw.info["sfreq"])
    notch = [f for f in (50.0, 60.0) if f < sfreq / 2.0]
    if notch:
        raw.notch_filter(freqs=notch, verbose="ERROR")
    raw.filter(0.5, 40.0, verbose="ERROR")
    if abs(sfreq - FS) > 1e-6:
        raw.resample(FS, npad="auto")
    return raw


def bipolar(seg, idx):
    """seg: (5_channels, n_samples) -> (2, n_samples) in volts."""
    fpz = seg[idx[REF]]
    return np.stack([
        seg[idx["A1"]] - seg[idx["B2"]] - fpz,
        seg[idx["A2"]] - seg[idx["B3"]] - fpz,
    ]).astype(np.float32)


def probe_predict(sess, ctx10s):
    """Slide 11 5s windows over the 10s context, z-score, run model, average softmax.

    Returns:
      pred:           argmax of mean softmax (probe-level prediction)
      mean_prob:      (n_classes,) softmax averaged across windows
      windows_z:      (n_channels, n_windows, n_samples) -- exact tensors fed to ONNX
      window_logits:  (n_windows, n_classes)
      window_probs:   (n_windows, n_classes)
    """
    input_name = sess.get_inputs()[0].name
    n_ch = ctx10s.shape[0]
    offsets = list(range(0, CONTEXT_N - WIN + 1, STEP_N))
    n_win = len(offsets)
    windows_z = np.zeros((n_ch, n_win, WIN), dtype=np.float32)
    window_logits = []
    window_probs = []
    for w, off in enumerate(offsets):
        win = ctx10s[:, off: off + WIN].copy()
        for ch in range(n_ch):
            s = win[ch].std()
            if s > 1e-12:
                win[ch] = (win[ch] - win[ch].mean()) / s
            windows_z[ch, w, :] = win[ch]
        x = win[None, :, :].astype(np.float32)
        logits = sess.run(None, {input_name: x})[0][0]
        e = np.exp(logits - logits.max())
        prob = e / e.sum()
        window_logits.append(logits)
        window_probs.append(prob)
    window_logits = np.asarray(window_logits, dtype=np.float32)
    window_probs = np.asarray(window_probs, dtype=np.float32)
    mean_prob = window_probs.mean(axis=0)
    return int(np.argmax(mean_prob)), mean_prob, windows_z, window_logits, window_probs


def find_snippets():
    """Walk subjects until we get one confirmed snippet per class."""
    sess = ort.InferenceSession(str(ORT_PATH), providers=["CPUExecutionProvider"])
    found = {}
    for sub_dir in sorted(DS_ROOT.glob("sub-*")):
        for ses_dir in sorted(sub_dir.glob("ses-*")):
            eeg_dir = ses_dir / "eeg"
            if not eeg_dir.is_dir():
                continue
            for eeg_path in sorted(eeg_dir.glob("*task-meditation*_eeg.bdf")):
                events_path = eeg_path.with_name(eeg_path.name.replace("_eeg.bdf", "_events.tsv"))
                if not events_path.exists():
                    continue
                try:
                    events_df = pd.read_csv(events_path, sep="\t")
                except Exception:
                    continue
                if not {"onset", "trial_type", "value"}.issubset(events_df.columns):
                    continue
                raw = load_recording(eeg_path)
                if raw is None:
                    continue
                idx = {c: raw.ch_names.index(c) for c in PRIMARY + [REF]}

                for i, row in events_df.iterrows():
                    if str(row.get("trial_type", "")).strip().lower() != "stimulus":
                        continue
                    val = row.get("value")
                    if pd.isna(val) or int(val) != 128:
                        continue
                    label = extract_probe_label(events_df, i)
                    if label not in ("meditation", "mind_wandering"):
                        continue
                    if label in found:
                        continue
                    probe_sample = int(round(float(row["onset"]) * FS))
                    snippet_start = probe_sample - SNIPPET_N
                    if snippet_start < 0 or probe_sample > raw.n_times:
                        continue

                    seg5 = raw.get_data(start=snippet_start, stop=probe_sample)
                    snip2 = bipolar(seg5, idx)             # (2, 7680) in volts

                    # Reject if the snippet has obvious artifacts
                    ptp_uv = (snip2.max(axis=1) - snip2.min(axis=1)) * 1e6
                    if (ptp_uv > 250).any():
                        continue

                    pred, prob, win_z, win_logits, win_probs = probe_predict(
                        sess, snip2[:, -CONTEXT_N:])
                    pred_label = LABEL_NAMES[pred]
                    print(f"  candidate {sub_dir.name} probe@{row['onset']:.1f}s "
                          f"truth={label} pred={pred_label} probs={prob.round(3)}")
                    if pred_label != label:
                        continue

                    found[label] = {
                        "subject": sub_dir.name,
                        "session": ses_dir.name,
                        "onset_sec": float(row["onset"]),
                        "snippet_start_sec": snippet_start / FS,
                        "data_uv": (snip2 * 1e6).astype(np.float32),  # (2, 7680) uV
                        "windows_z": win_z,                            # (2, 11, 1280)
                        "window_logits": win_logits,                   # (11, 2)
                        "window_probs": win_probs,                     # (11, 2)
                        "model_probs": prob.tolist(),
                        "model_pred": pred_label,
                        "ground_truth": label,
                    }
                    if len(found) == 2:
                        return found
    return found


def _flat_array(name, flat_values, per_line=8):
    """Render a flat C array initializer as a list of source lines."""
    out = [f"{name} = {{"]
    for i in range(0, len(flat_values), per_line):
        chunk = flat_values[i:i + per_line]
        out.append("    " + ", ".join(f"{v: .6f}f" for v in chunk) + ",")
    out.append("};")
    return out


def emit_c_header(snippets, out_path: Path):
    n_win = next(iter(snippets.values()))["windows_z"].shape[1]
    n_classes = next(iter(snippets.values()))["window_probs"].shape[1]

    lines = []
    lines.append("// Auto-generated by export_snippets.py.  Do not edit by hand.")
    lines.append("// Two 30-second EEG snippets from ds001787, model-confirmed.")
    lines.append("//")
    lines.append("// Per snippet you get:")
    lines.append("//   eeg_<label>_channels[ch][sample]      raw bipolar uV, full 30 s")
    lines.append("//   eeg_<label>_windows[ch][win][sample]  z-scored 5 s windows fed to ONNX")
    lines.append("//   eeg_<label>_window_probs[win][class]  softmax per window (expected)")
    lines.append("//   eeg_<label>_window_logits[win][class] raw logits per window (expected)")
    lines.append("//   eeg_<label>_mean_prob[class]          mean softmax = probe prediction")
    lines.append("//")
    lines.append("// Channels: ch0 = (Fp1-Fp2)-Fpz, ch1 = (AF7-AF8)-Fpz")
    lines.append("// Classes: 0 = meditation, 1 = mind_wandering")
    lines.append("// Window slide: 11 windows of 5 s, step 0.5 s, over the last 10 s of the snippet.")
    lines.append("#pragma once")
    lines.append("#include <stddef.h>")
    lines.append("")
    lines.append(f"#define EEG_SNIPPET_FS_HZ            {FS}")
    lines.append(f"#define EEG_SNIPPET_N_CHANNELS       2")
    lines.append(f"#define EEG_SNIPPET_N_SAMPLES        {SNIPPET_N}")
    lines.append(f"#define EEG_SNIPPET_N_WINDOWS        {n_win}")
    lines.append(f"#define EEG_SNIPPET_WINDOW_SAMPLES   {WIN}")
    lines.append(f"#define EEG_SNIPPET_WINDOW_STEP      {STEP_N}")
    lines.append(f"#define EEG_SNIPPET_CONTEXT_SAMPLES  {CONTEXT_N}")
    lines.append(f"#define EEG_SNIPPET_N_CLASSES        {n_classes}")
    lines.append("")

    for label, info in snippets.items():
        var = f"eeg_{label}"
        lines.append(f"// --- {label.upper()} ---")
        lines.append(f"// source: {info['subject']}/{info['session']}  "
                     f"probe onset = {info['onset_sec']:.3f} s")
        lines.append(f"// snippet covers t = [{info['snippet_start_sec']:.3f}, "
                     f"{info['snippet_start_sec'] + SNIPPET_SEC:.3f}] s")
        lines.append(f"// probe-level prediction = {info['model_pred']}  "
                     f"mean_prob[meditation,mind_wandering] = "
                     f"[{info['model_probs'][0]:.4f}, {info['model_probs'][1]:.4f}]")
        lines.append("")

        # 1. Full 30 s raw bipolar (uV), per channel ----------------------
        data = info["data_uv"]
        for ch in range(data.shape[0]):
            ch_name = ["Fp1mFp2_minus_Fpz", "AF7mAF8_minus_Fpz"][ch]
            lines += _flat_array(
                f"static const float {var}_ch{ch}_{ch_name}_uv[EEG_SNIPPET_N_SAMPLES]",
                data[ch].tolist(),
            )
            lines.append("")
        lines.append(f"static const float * const {var}_channels[EEG_SNIPPET_N_CHANNELS] = {{")
        lines.append(f"    {var}_ch0_Fp1mFp2_minus_Fpz_uv,")
        lines.append(f"    {var}_ch1_AF7mAF8_minus_Fpz_uv,")
        lines.append("};")
        lines.append("")

        # 2. Z-scored sliding windows fed to the model: [ch][win][sample] -
        win_z = info["windows_z"]  # (n_ch, n_win, win_samples)
        lines.append(f"// Indexing: {var}_windows[channel][window][sample]")
        lines.append(f"static const float "
                     f"{var}_windows[EEG_SNIPPET_N_CHANNELS]"
                     f"[EEG_SNIPPET_N_WINDOWS][EEG_SNIPPET_WINDOW_SAMPLES] = {{")
        for ch in range(win_z.shape[0]):
            lines.append(f"    // channel {ch}")
            lines.append("    {")
            for w in range(win_z.shape[1]):
                lines.append(f"        // window {w}  (t_start = {w * STEP_SEC:.1f} s into context)")
                lines.append("        {")
                row = win_z[ch, w].tolist()
                for i in range(0, len(row), 8):
                    chunk = row[i:i + 8]
                    lines.append("            " + ", ".join(f"{v: .6f}f" for v in chunk) + ",")
                lines.append("        },")
            lines.append("    },")
        lines.append("};")
        lines.append("")

        # 3. Per-window expected outputs ---------------------------------
        wp = info["window_probs"]   # (n_win, n_classes)
        wl = info["window_logits"]  # (n_win, n_classes)
        lines.append(f"// Indexing: {var}_window_probs[window][class]")
        lines.append(f"static const float "
                     f"{var}_window_probs[EEG_SNIPPET_N_WINDOWS][EEG_SNIPPET_N_CLASSES] = {{")
        for w in range(wp.shape[0]):
            lines.append("    { " + ", ".join(f"{v: .6f}f" for v in wp[w]) + f" }},   // window {w}")
        lines.append("};")
        lines.append("")
        lines.append(f"static const float "
                     f"{var}_window_logits[EEG_SNIPPET_N_WINDOWS][EEG_SNIPPET_N_CLASSES] = {{")
        for w in range(wl.shape[0]):
            lines.append("    { " + ", ".join(f"{v: .6f}f" for v in wl[w]) + f" }},   // window {w}")
        lines.append("};")
        lines.append("")
        lines.append(f"static const float {var}_mean_prob[EEG_SNIPPET_N_CLASSES] = {{ "
                     + ", ".join(f"{v: .6f}f" for v in info["model_probs"]) + " };")
        lines.append("")

    out_path.write_text("\n".join(lines))
    print(f"wrote {out_path}  ({out_path.stat().st_size/1024:.1f} KB)")


def emit_npz(snippets, out_path: Path):
    payload = {"fs": np.int32(FS)}
    for label, info in snippets.items():
        payload[f"{label}_uv"] = info["data_uv"]
        payload[f"{label}_windows_z"] = info["windows_z"]
        payload[f"{label}_window_probs"] = info["window_probs"]
        payload[f"{label}_window_logits"] = info["window_logits"]
        payload[f"{label}_mean_prob"] = np.asarray(info["model_probs"], dtype=np.float32)
    np.savez(out_path, **payload)
    print(f"wrote {out_path}")


def main():
    snippets = find_snippets()
    missing = {"meditation", "mind_wandering"} - set(snippets)
    if missing:
        print(f"ERROR: could not find verified snippets for: {missing}", file=sys.stderr)
        sys.exit(1)
    out_dir = ROOT / "artifacts"
    emit_c_header(snippets, out_dir / "eeg_snippets.h")
    emit_npz(snippets, out_dir / "eeg_snippets.npz")
    for lbl, info in snippets.items():
        print(f"{lbl:>14}: {info['subject']}/{info['session']} "
              f"probe@{info['onset_sec']:.1f}s  pred={info['model_pred']} "
              f"probs={[round(p,4) for p in info['model_probs']]}")


if __name__ == "__main__":
    main()
