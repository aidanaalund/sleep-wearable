import numpy as np
from scipy.signal import welch


def eeg_features(eeg, fs=EEG_FS):
    feats = []
    bands = {
        "delta": (0.5, 4),
        "theta": (4, 8),
        "alpha": (8, 12),
        "sigma": (12, 16),
        "beta": (16, 30),
    }

    for ch in range(EEG_CHANNELS):
        x = eeg[ch]
        f, psd = welch(x, fs=fs, nperseg=min(256, len(x)))
        total = np.sum(psd) + 1e-12

        band_vals = {}
        for name, (lo, hi) in bands.items():
            mask = (f >= lo) & (f < hi)
            val = np.sum(psd[mask])
            feats.append(val)
            feats.append(val / total)
            band_vals[name] = val

        feats.append(band_vals["theta"] / (band_vals["alpha"] + 1e-12))
        feats.append(band_vals["delta"] / (band_vals["beta"] + 1e-12))
        feats.append(band_vals["sigma"] / (band_vals["theta"] + 1e-12))

        feats.append(np.mean(x))
        feats.append(np.std(x))
        feats.append(np.sqrt(np.mean(x**2)))
        feats.append(np.mean(np.diff(np.signbit(x)) != 0))

    return np.array(feats, dtype=np.float32)