# Sleep Classification System — Developer Handoff

## Overview

This system performs sleep classification using two ONNX models:

1. **EEG Stage Model**

   * Input: engineered features from 30-second EEG window
   * Output: one of 5 classes → `Wake, N1, N2, N3, REM`

2. **IMU Sleep Gate Model**

   * Input: engineered features from 30-second accelerometer window
   * Output: binary → `awake (0), asleep (1)`

### Fusion Logic

At runtime:

* Use EEG model as primary predictor
* If EEG is uncertain between **Wake and N1**, use IMU model to decide

---

## Files Provided

```
artifacts/
  stage_model.onnx
  sleep_gate.onnx
  stage_feature_schema.json
  sleep_gate_feature_schema.json
  fusion_rule.json
  training_summary.json
```

---

## Model Inputs

### EEG Model

* **Input name:** `input`
* **Shape:** `(1, 34)`
* **Type:** `float32`

Each input is a **feature vector**, NOT raw EEG.

#### Signal assumptions

* Channels: `HB_1`, `HB_2`
* Sampling rate: `256 Hz`
* Window length: `30 seconds`
* Samples per window: `7680`

#### Feature breakdown

* 2 channels
* 17 features per channel
* Total = 34 features

Features include:

* band powers (delta, theta, alpha, sigma, beta)
* relative band powers
* band ratios
* statistical features (mean, std, RMS, zero-crossing rate)

---

### IMU Model

* **Input name:** `input`
* **Shape:** `(1, 13)`
* **Type:** `float32`

Each input is a feature vector from a 30-second accelerometer window.

#### Signal assumptions

* 3-axis accelerometer
* Sampling rate ≈ `30 Hz`
* Window length: `30 seconds`

#### Features include:

* magnitude statistics (mean, std, variance, median, IQR, RMS)
* activity measures (sum abs diff, jerk)
* frequency features (PSD, peak frequency)
* activity distribution (quiet vs active percentage)

---

## Feature Extraction Requirement

The ONNX models DO NOT accept raw sensor data.

You MUST implement feature extraction before inference.

Reference implementation is provided in Python:

```
feature_extraction_reference.py
```

This must be ported to JS

---

## Inference Flow

```python
eeg_features = extract_eeg_features(eeg_window)      # shape (34,)
imu_features = extract_imu_features(imu_window)      # shape (13,)

stage_probs = eeg_model(eeg_features)                # shape (5,)
sleep_prob = imu_model(imu_features)                 # scalar or (1,)

if is_uncertain_between_wake_n1(stage_probs):
    if sleep_prob > 0.5:
        final_stage = "N1"
    else:
        final_stage = "Wake"
else:
    final_stage = argmax(stage_probs)
```

---

## Fusion Rule

From `fusion_rule.json`:

* If EEG prediction between Wake and N1 is close:

  * Threshold: `wake_n1_margin = 0.10`
* Then:

  * If IMU predicts asleep (`> 0.5`) → choose `N1`
  * Else → choose `Wake`

---

## Output Interpretation

### EEG model output

Softmax probabilities:

```
[Wake, N1, N2, N3, REM]
```

### IMU model output

Binary probability:

```
0 → awake
1 → asleep
```

---



---

## Validation (Recommended)

Use sample inputs to verify correctness:

* Input shape matches expected
* Outputs are valid probabilities
* Fusion logic behaves as expected

---

## Key Constraints

* Windows must be exactly **30 seconds**
* EEG must be sampled at **256 Hz**
* Channel order must match training (`HB_1`, `HB_2`)
* Feature order must match schema JSON exactly

---

## Known Limitations

* Model expects clean, preprocessed signals
* No artifact rejection included
* Performance depends on correct feature extraction
* N1 class is relatively underrepresented

---

## Summary

You are integrating:

* 2 ONNX models
* Feature extraction layer (required)
* Simple fusion logic

