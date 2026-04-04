from scipy.stats import iqr


def imu_features(accel, fs=IMU_FS):
    mag = np.sqrt(np.sum(accel**2, axis=1))
    f, psd = welch(mag, fs=fs, nperseg=min(256, len(mag)))

    feats = [
        np.mean(mag),
        np.std(mag),
        np.var(mag),
        np.median(mag),
        iqr(mag),
        np.sqrt(np.mean(mag**2)),
        np.sum(np.abs(np.diff(mag))),
        np.mean(np.abs(np.diff(mag))) if len(mag) > 1 else 0,
        np.std(np.diff(mag)) if len(mag) > 1 else 0,
        np.sum(psd),
        f[np.argmax(psd)] if len(f) else 0,
        np.mean(mag < np.percentile(mag, 25)),
        np.mean(mag > np.percentile(mag, 75)),
    ]

    return np.array(feats, dtype=np.float32)