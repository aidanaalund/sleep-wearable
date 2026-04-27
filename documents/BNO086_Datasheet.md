# BNO08X (BNO085/BNO086) Datasheet — Driver Reference

> Condensed from CEVA BNO08X Datasheet Revision 1.17 (2023). Optimized for writing
> Zephyr RTOS drivers. Detailed electrical/AC timing curves and packaging info have
> been summarized; protocol, report, and command details are preserved in full.

## 1. Overview

The BNO08X is a System in Package (SiP) integrating:

- Triaxial 12-bit accelerometer, range ±8g
- Triaxial 16-bit gyroscope, range ±2000°/s
- Triaxial geomagnetic sensor (magnetometer)
- 32-bit ARM Cortex-M0+ microcontroller running CEVA's SH-2 firmware (with MotionEngine)
- 28-pin LGA package, 3.8 × 5.2 × 1.1 mm

Sensors are from Bosch Sensortec; the MCU is by Atmel. The BNO086 is a drop-in
replacement for the BNO085 (identical pinout and software feature set), and adds
14-bit accelerometer fusion, lower idle power, and Interactive Calibration.

The chip provides processed motion outputs (orientation quaternions, linear accel,
gravity, calibrated gyro/mag, etc.), classification features (step counter, tap,
stability, shake, significant motion, activity), and supports environmental sensors
on a secondary I²C bus.

Host communication interfaces: **I²C, UART (SHTP), SPI, UART-RVC**, plus a bootloader
for DFU.

---

## 2. Pinout (28-pin LGA)

| Pin | Name | Mode | Description |
|-----|------|------|-------------|
| 1 | RESV_NC | NC | Reserved, no connect |
| 2 | GND | Input | Ground |
| 3 | VDD | Input | Sensor supply (2.4 V – 3.6 V) |
| 4 | BOOTN | Input | Bootloader mode select (low at reset → bootloader) |
| 5 | PS1 | Input | Protocol select pin 1 |
| 6 | PS0/WAKE | Input | Protocol select pin 0; doubles as SPI WAKE after reset |
| 7 | RESV_NC | Input | Reserved, no connect |
| 8 | RESV_NC | NC | Reserved, no connect |
| 9 | CAP | — | External 100 nF cap to GND |
| 10 | CLKSEL0 | Input | Clock source selection (internal pulldown) |
| 11 | NRST | Input | Active-low reset |
| 12 | RESV_NC | NC | Reserved, no connect |
| 13 | RESV_NC | NC | Reserved, no connect |
| 14 | H_INTN | Output | Active-low interrupt to host |
| 15 | ENV_SCL | Bidir | Environmental sensor I²C clock |
| 16 | ENV_SDA | Bidir | Environmental sensor I²C data |
| 17 | SA0 / H_MOSI | Input | I²C address LSB / SPI MOSI |
| 18 | H_CSN | Input | SPI chip select, active low |
| 19 | H_SCL / SCK / RX | Bidir | I²C clock / SPI clock / UART RX |
| 20 | H_SDA / H_MISO / TX | Bidir | I²C data / SPI MISO / UART TX |
| 21–24 | RESV_NC | NC | Reserved, no connect |
| 25 | GND | Input | Ground |
| 26 | XOUT32 / CLKSEL1 | Output | 32 kHz crystal output / clock-source select (pulldown) |
| 27 | XIN32 | Input | 32 kHz crystal input / external clock |
| 28 | VDDIO | Input | Core/IO supply (1.65 V – 3.6 V) |

### 2.1 Clock Source Selection

| Source | CLKSEL0 | CLKSEL1 |
|--------|---------|---------|
| Crystal (32.768 kHz, 50 ppm, 12.5 pF) | 0 / NC | Tied to crystal |
| External clock (50 ppm) | 1 | 1 |
| Internal | 1 | 0 / NC |

> **Important:** the internal clock is **not accurate enough** for UART-SHTP or
> UART-RVC. Use external clock or crystal for UART modes.

---

## 3. Protocol Selection

The PS1/PS0 pins (sampled at reset) and BOOTN pin choose the host interface:

| PS1 | PS0 | BNO08X (BOOTN=1) | Bootloader (BOOTN=0) |
|-----|-----|------------------|----------------------|
| 0 | 0 | I²C | I²C |
| 0 | 1 | UART-RVC | Reserved |
| 1 | 0 | UART-SHTP | UART |
| 1 | 1 | SPI | SPI |

In **SPI mode**, PS0 is repurposed as the WAKE signal *after* reset.

---

## 4. Host Interfaces

### 4.1 I²C

- Standard Fast-mode, up to **400 kbps**
- 7-bit slave address: `0b1001010X` where X = SA0 pin
  - SA0 = 0 → `0x4A`; SA0 = 1 → `0x4B`
- Bootloader I²C address: `0x28` or `0x29` (SA0 LSB)
- Master MUST support **clock stretching**
- Multi-byte data is **little-endian**, byte transfers are MSB-first
- Repeated-start register-style accesses are **not** supported by the application
  (uses SHTP framing, see §5)
- BNO085 polling with no data → device stretches clock until data is available
- BNO086 polling with no data → device returns zero-length packet; host should
  read the length field and **ignore zero-length packets**

#### Connection guidelines
- `H_INTN` (active low) → GPIO with wake capability
- `BOOTN` → 10 kΩ pull-up; tie to GPIO if DFU is needed
- `PS1`, `PS0` → both tied to GND for I²C
- `H_SCL`/`H_SDA` need pull-ups (~2–4 kΩ depending on bus capacitance)
- Secondary `ENV_SCL`/`ENV_SDA` lines must be pulled up regardless of presence of
  environmental sensors (firmware probes them at reset)

### 4.2 UART-SHTP

- 3 Mbps, 8N1, no parity, idle high
- LSB first
- Bytes from host → BNO must be separated by **≥ 100 µs**
- Bytes from BNO → host have no extra spacing
- `H_INTN` is asserted low ~7.7 µs before the first byte of a transmission and
  deasserts before the last byte; used for host-side timestamping
- Requires external clock or crystal
- Pin tying: PS1 = VDDIO, PS0 = GND
- Uses SHTP framing (see §5) with start/end framing bytes

### 4.3 SPI

- 4-wire, mode 3 (CPOL = 1, CPHA = 1; clock idles high, sampled on rising edge)
- Up to 3 MHz
- MSB first, 8-bit byte oriented
- BNO08X is always slave
- `H_INTN` indicates the BNO has data ready or has woken up
- Pin tying: PS1 = VDDIO, PS0 = GPIO (used as WAKE *after* reset)

#### Wake operation
1. Host drives PS0/WAKE low
2. BNO asserts `H_INTN` low
3. Host asserts `H_CSN` and reads/writes
4. BNO deasserts `H_INTN` once `H_CSN` is observed

#### Responding to H_INTN
If the host fails to respond to `H_INTN` within ~10 ms, the BNO times out,
deasserts `H_INTN`, and retries. Repeated delays cause processing starvation
and degraded outputs. **Target: handle `H_INTN` within 1/10 of the fastest
configured sensor period.**

### 4.4 UART-RVC

- 115200 bps, 8N1, no parity, idle high
- One-way, 100 Hz, fixed 19-byte packets transmitted by BNO
- Requires external clock or crystal
- Pin tying: PS1 = GND, PS0 = VDDIO

#### RVC Packet Format (19 bytes)

| Offset | Field | Notes |
|--------|-------|-------|
| 0–1 | Header | `0xAA 0xAA` |
| 2 | Index | Monotonic 8-bit counter |
| 3–4 | Yaw | int16 LE, 0.01° units, ±180° around Z |
| 5–6 | Pitch | int16 LE, 0.01° units, ±90° around Y |
| 7–8 | Roll | int16 LE, 0.01° units, ±180° around X |
| 9–10 | X accel | int16 LE, mg |
| 11–12 | Y accel | int16 LE, mg |
| 13–14 | Z accel | int16 LE, mg |
| 15 | MI | BNO086: Motion Intent. Otherwise reserved |
| 16 | MR | BNO086: Motion Request. Otherwise reserved |
| 17 | Reserved | One byte (BNO086) or three (otherwise), zero |
| 18 | Csum | Sum of bytes 2–17 (Index, yaw, pitch, roll, accel, reserved) |

Apply rotations in order **yaw → pitch → roll** to recover orientation.

Example (from datasheet):
`AA AA DE 01 00 92 FF 25 08 8D FE EC FF D1 03 00 00 00 E7`
- Index = 0xDE = 222
- Yaw = 0x0001 → 0.01°
- Pitch = 0xFF92 → −1.10°
- Roll = 0x0825 → 20.85°
- X = 0xFE8D → −371 mg
- Y = 0xFFEC → −20 mg
- Z = 0x03D1 → 977 mg
- Csum = 0xE7

#### RVC startup banner
On reset, the BNO transmits an ASCII banner, e.g.:
```
%Hillcrest Labs 10003608
%SW Ver 3.2.x
%(c) 2017 Hillcrest Laboratories, Inc.
```
Then 100 Hz packets stream continuously.

---

## 5. SHTP (Sensor Hub Transport Protocol)

Used by I²C, UART-SHTP, and SPI. Every transfer begins with a 4-byte header:

| Byte | Field |
|------|-------|
| 0 | Length LSB |
| 1 | Length MSB (bit 15 = continuation flag) |
| 2 | Channel |
| 3 | SeqNum |

- **Length:** total bytes including header. Bit 15 of MSB byte = continuation
  flag (host shouldn't send fragmented messages to the BNO; the BNO can send
  them). Length `0xFFFF` is reserved (failure marker). Max cargo = 32766 − 4.
- **Channel:** SHTP channel number (see below)
- **SeqNum:** monotonic per-channel-per-direction counter (used to detect drops
  and pair fragments)

The length field allows hosts to schedule the right number of clocks for I²C/SPI
reads. Partial reads are supported — read 4 bytes to get the length, then re-read
with the right size.

### 5.1 SHTP Channels

| Ch | Name | Purpose |
|----|------|---------|
| 0 | Command | SHTP control |
| 1 | Executable | Reset / on / sleep commands |
| 2 | SH-2 control | Sensor hub config and responses |
| 3 | Input reports | Non-wake sensor reports (excluding gyro RV) |
| 4 | Wake input reports | Reports from sensors flagged as wake |
| 5 | Gyro RV | Gyro Rotation Vector (separate channel for low latency) |

### 5.2 Executable Channel (Channel 1)

| Direction | Value | Meaning |
|-----------|-------|---------|
| Host → BNO | 0 | Reserved |
| Host → BNO | 1 | Reset |
| Host → BNO | 2 | On (re-enable all sensors) |
| Host → BNO | 3 | Sleep (only wake/always-on sensors keep running) |
| BNO → Host | 1 | Reset complete |

### 5.3 Reset Sequence

After power-on or NRST:
1. BNO asserts `H_INTN` when ready
2. Host reads the **SHTP advertisement packet** (channel maps, packet length info)
3. Executable channel sends a reset message
4. SH-2 sends an unsolicited initialization message on channel 2
5. BNO waits for host configuration

Startup timing (typ): NRST pulse ≥ 10 ns, internal init ≈ 90 ms, internal
config ≈ 4 ms before `H_INTN` first asserts.

---

## 6. SH-2 Report IDs (Channel 2 — Sensor Hub Control)

All commands/responses on channel 2 begin with a Report ID (after the SHTP header):

| Report ID | Direction | Description |
|-----------|-----------|-------------|
| 0xFE | Host → BNO | Get Feature Request |
| 0xFD | Host → BNO | Set Feature Command |
| 0xFC | BNO → Host | Get Feature Response |
| 0xF9 | Host → BNO | Product ID Request |
| 0xF8 | BNO → Host | Product ID Response |
| 0xF7 | Host → BNO | FRS Write Request |
| 0xF6 | Host → BNO | FRS Write Data |
| 0xF5 | BNO → Host | FRS Write Response |
| 0xF4 | Host → BNO | FRS Read Request |
| 0xF3 | BNO → Host | FRS Read Response |
| 0xF2 | Host → BNO | Command Request |
| 0xF1 | BNO → Host | Command Response |
| 0xFB | BNO → Host | Timebase Reference (precedes input reports) |

### 6.1 Product ID Request (0xF9)

| Byte | Field |
|------|-------|
| 0 | Report ID = 0xF9 |
| 1 | Reserved |

### 6.2 Product ID Response (0xF8)

| Byte | Field |
|------|-------|
| 0 | Report ID = 0xF8 |
| 1 | Reset Cause |
| 2 | SW Version Major |
| 3 | SW Version Minor |
| 4–7 | SW Part Number (LE) |
| 8–11 | SW Build Number (LE) |
| 12–13 | SW Version Patch (LE) |
| 14–15 | Reserved |

### 6.3 Set Feature Command (0xFD)

| Byte | Field |
|------|-------|
| 0 | Report ID = 0xFD |
| 1 | Feature Report ID (the sensor to configure) |
| 2 | Feature flags (bit 1 = wake; see [1]) |
| 3–4 | Change sensitivity (signed, abs/rel selected by flags) |
| 5–8 | Report Interval (µs, LE) |
| 9–12 | Batch Interval (µs, LE) |
| 13–16 | Sensor-specific configuration word (LE) |

Sensors can be configured for:
- **Periodic reporting** (Report Interval)
- **Change-only reporting** (Change Sensitivity, absolute or relative threshold)
- **Batching** (Batch Interval — accumulate before pushing to host; supports
  power-saving by letting host sleep)

A sensor flagged as a wake sensor cannot also be a non-wake (always-on) sensor —
each sensor type has only one batch queue.

The BNO emits a **Get Feature Response** (0xFC) immediately after a Set Feature
and again whenever the operating rate changes.

### 6.4 Effective Sample Rate

The BNO will satisfy:

```
0.9 × RequestedRate ≤ ConfiguredRate ≤ 2.1 × RequestedRate
```

depending on underlying sensor capabilities.

---

## 7. Sensor Input Reports

Each sensor has a dedicated Report ID for its input report (delivered on channel
3, 4, or 5). All input reports share the same general layout: report ID, sequence
number, status, delay, then the payload.

### 7.1 Common Input Report Header

| Byte | Field |
|------|-------|
| 0 | Report ID (sensor specific) |
| 1 | Sequence number (monotonic; gaps = dropped samples) |
| 2 | Status: bits[1:0] = accuracy; bits[7:2] = delay upper 6 bits |
| 3 | Delay: lower 8 bits of delay (resolution: 100 µs) |
| 4..N | Sensor data |

Accuracy values:

| Bits[1:0] | Meaning |
|-----------|---------|
| 0 | Unreliable |
| 1 | Low |
| 2 | Medium |
| 3 | High |

### 7.2 Calibrated Gyroscope Report (Report ID 0x02)

| Byte | Field |
|------|-------|
| 0 | 0x02 |
| 1 | Seq |
| 2 | Status |
| 3 | Delay |
| 4–5 | X (int16 LE, rad/s with Q-point per metadata) |
| 6–7 | Y |
| 8–9 | Z |

(Other sensors use the same template with different report IDs and payload.
Refer to SH-2 Reference Manual [1] for the full list.)

### 7.3 Timebase Reference Report (0xFB)

Often prepended to a batch of sensor reports:

| Byte | Field |
|------|-------|
| 0 | 0xFB |
| 1–4 | Base Delta (signed, LE, units of 100 µs) |

To timestamp a sample:

```
sample_time = host_intn_timestamp − base_delta − sensor_report_delay
```

When a Timebase Reference precedes a report, the report's own delay is usually
zero, but if reports are concatenated due to processing delay, the report's
delay field will also be populated and must be added on top of the base delta.

Example: timebase delta = 120 (12 ms), report 1 delay = 0, report 2 delay = 17:
- Report 1 timestamp = T − 12 ms
- Report 2 timestamp = T − 12 ms + 1.7 ms = T − 10.3 ms

---

## 8. FRS (Flash Record System)

Persistent configuration is stored in flash records. Records are read/written via
the FRS Read/Write request/response sequence on channel 2.

### 8.1 FRS Records

| Record ID | Description |
|-----------|-------------|
| 0x7979 | Static calibration – AGM |
| 0x4D4D | Nominal calibration – AGM |
| 0x8A8A | Static calibration – SRA |
| 0x4E4E | Nominal calibration – SRA |
| 0x1F1F | Dynamic calibration |
| 0xD3E2 | MotionEngine power management |
| 0x2D3E | System orientation |
| 0x2D41 | Primary accelerometer orientation |
| 0x2D46 | Gyroscope orientation |
| 0x2D4C | Magnetometer orientation |
| 0x3E2D | AR/VR stabilization – Rotation Vector |
| 0x3E2E | AR/VR stabilization – Game Rotation Vector |
| 0xC274 | Significant Motion detector configuration |
| 0x7D7D | Shake detector configuration |
| 0xD7D7 | Maximum fusion period |
| 0x4B4B | Serial number |
| 0x39AF | Pressure calibration |
| 0x4D20 | Temperature calibration |
| 0x1AC9 | Humidity calibration |
| 0x39B1 | Ambient light calibration |
| 0x4DA2 | Proximity calibration |
| 0xD401 | ALS calibration |
| 0xD402 | Proximity sensor calibration |
| 0xED85 | Stability detector configuration |
| 0x74B4 | User record |
| 0xD403 | MotionEngine Time Source Selection |
| 0xA1A2 | Gyro-Integrated Rotation Vector configuration |

### 8.2 FRS Write Sequence
1. Host → BNO: FRS Write Request (record ID, length)
2. BNO → Host: FRS Write Response (ack)
3. Host → BNO: FRS Write Data (repeated)
4. BNO → Host: Final FRS Write Response (success or failure)

### 8.3 FRS Read Sequence
1. Host → BNO: FRS Read Request (record ID)
2. BNO → Host: FRS Read Response (data, repeated until completion marker)

### 8.4 Sensor Metadata

Sensor metadata is also stored as FRS records. Each metadata record contains:

- Version (LSB = ME, byte 1 = MH, byte 2 = SH)
- Range (unsigned fixed-point, units & Q-point match input report)
- Resolution (same format)
- Power (mA, Q-point 10)
- Revision
- Min period (µs)
- FIFO max count, FIFO reserved count, batch buffer bytes
- Vendor ID length
- Q points 1, 2, 3 (signed 16-bit) for data, bias/accuracy, change sensitivity
- Sensor-specific metadata length (must be multiple of 4)
- Max period (µs)
- Sensor-specific metadata
- Vendor ID string (null-terminated)

---

## 9. Available Motion Outputs

### 9.1 Acceleration
- **Calibrated Acceleration** (m/s², includes gravity)
- **Linear Acceleration** (m/s², gravity removed; requires gyro fusion)
- **Gravity** (m/s²)
- **Raw Accelerometer** (ADC units; requires accelerometer to be enabled separately)

### 9.2 Angular Velocity
- **Calibrated Gyroscope** (rad/s)
- **Uncalibrated Gyroscope** (rad/s, with bias as second output; for Android compat)
- **Raw Gyroscope** (ADC units; requires gyroscope enabled separately)

### 9.3 Magnetometer
- **Magnetic Field Calibrated** (µT)
- **Magnetic Field Uncalibrated** (µT, with hard-iron offset as second output)
- **Raw Magnetic Field** (ADC units)

### 9.4 Orientation (Quaternions)

| Output | Sensors used | Notes |
|--------|-------------|-------|
| Geomagnetic Rotation Vector | Accel + Mag | Lower power, less responsive, mag-error sensitive |
| Game Rotation Vector | Accel + Gyro | No magnetic reference; yaw drifts long-term |
| AR/VR Stabilized Game Rotation Vector | Accel + Gyro | Reduces sudden corrections; tunable via FRS |
| Rotation Vector | Accel + Gyro + Mag | Most accurate; references magnetic north |
| AR/VR Stabilized Rotation Vector | All three | Smoothed corrections for AR/VR |
| Gyro Rotation Vector | Optimized | Up to 1 kHz, low latency for HMDs |
| Gyro Rotation Vector Prediction | Predicted | Forecasts ~20–30 ms ahead |

### 9.5 Maximum Sensor Rates

| Sensor | Max rate (Hz) |
|--------|--------------|
| Gyro Rotation Vector | 1000 |
| Rotation Vector | 400 |
| Game Rotation Vector | 400 |
| Geomagnetic Rotation Vector | 90 |
| Gravity | 400 |
| Linear Acceleration | 400 |
| Accelerometer | 500 |
| Gyroscope | 400 |
| Magnetometer | 100 |

Sensors cannot all run at maximum simultaneously — bandwidth and processing time
must be balanced.

### 9.6 Typical Latency

| Sensor | @100 Hz | @200 Hz |
|--------|---------|---------|
| Gyro Rotation Vector | 6.6 ms | 3.7 ms |
| Rotation Vector | 6.6 ms | 3.7 ms |
| Game Rotation Vector | 6.6 ms | 3.7 ms |

---

## 10. Classification / Always-On Features

### 10.1 Stability Detector & Classifier
- **Detector** uses accel only (lower power); reports stable/motion based on
  acceleration threshold (default 0.784 m/s²) over a time threshold (default 500 ms)
- **Classifier** uses accel + gyro; reports On Table / Stable / Motion. Default
  thresholds: 1 rad/s, 3 s. Configured via FRS 0xD3E2 (MotionEngine power /
  stability classifier) and 0xED85 (stability detector).

### 10.2 Tap Detector
- Uses accelerometer; reports single or double tap and the axis it occurred on
- Axes match the Android frame of reference

### 10.3 Step Detector / Counter
- **Step Detector** outputs 1.0 per step. Configurable: `watchSelector` (1 for
  wrist worn), `allowTime` (default 250 ms), `stepMinTime` (default 300 ms),
  `groupDelay` (90 ms — don't change without consultation), `threshold`
  (3.1 mm), `thresholdWatch` (0.01), `thresholdNonWatch` (1.2e-4)
- **Step Counter** is a 16-bit counter built on the detector with reclassification
  for accuracy. Host must accumulate 64-bit total across rollovers; the BNO will
  wake the host before overflow.

### 10.4 Activity Classifier
- Uses accel (and optionally an external pressure sensor for stair detection)
- Classes: Still / Walking / Running / On Stairs / In-Vehicle / On-Bicycle / Tilting
- Defaults: walk step rate 0.75–2.25/s, run lower 1.25/s; signal-strength
  thresholds: walk 0.75–4.50 m²/s², run 3.20–23.50 m/s²
- 4 s analysis window

### 10.5 Significant Motion Detector
- Auto-disables after firing (per Android spec)
- Defaults: 5-step threshold, 10 m/s² acceleration threshold
- Configured via FRS 0xC274

### 10.6 Shake Detector
- Defaults: 8 m/s² magnitude, 3 direction changes, 50–400 ms between changes,
  all axes
- Configured via FRS 0x7D7D

---

## 11. Coordinate System & Orientation

The BNO uses the Android frame of reference:
- X: horizontal, right = positive
- Y: vertical, up = positive
- Z: out of the front face = positive
- Counter-clockwise rotations are positive

### 11.1 Mounting Orientation (FRS 0x2D3E)

The system orientation FRS record is a unit quaternion `(qw, qx, qy, qz)`
applied to all sensor outputs. Each component is signed Q30 fixed-point (32-bit).

Example mappings (BNO-axis → device-axis when device frame is East/North/Up):

| BNO X | BNO Y | BNO Z | Qw | Qx | Qy | Qz |
|-------|-------|-------|----|----|----|----|
| East | North | Up | 1 | 0 | 0 | 0 |
| North | West | Up | √2/2 | 0 | 0 | √2/2 |
| West | South | Up | 0 | 0 | 0 | 1 |
| South | East | Up | √2/2 | 0 | 0 | −√2/2 |
| East | South | Down | 0 | 0 | −1 | 0 |
| North | East | Down | 0 | −√2/2 | −√2/2 | 0 |
| West | North | Down | 0 | −1 | 0 | 0 |
| South | West | Down | 0 | −√2/2 | √2/2 | 0 |

(Datasheet has full 24-row table for all axis-aligned orientations.)

### 11.2 Tare

Two flavours:
- **Tare around all axes** — solves tilt + heading
- **Tare around Z** — solves heading only

After tare, call **Persist Tare** to save across resets. Note: persist-tare does
not apply to the Game Rotation Vector — for that, the BNO must be reset to apply
tare-Z.

For Rotation Vector / Geomagnetic Rotation Vector, magnetic north must be
resolved before taring (otherwise calibration will shift the heading later).

See the BNO08X Tare Function Usage Guide [8].

---

## 12. Calibration

### 12.1 Categories

- **Static calibration** — non-varying offsets, scaling, skew, sensor orientation
  relative to device. Stored in the SCD record.
- **Dynamic calibration** — runs on-chip continuously; corrects offsets that
  vary over time/temperature (gyro ZRO, accel ZGO, magnetometer hard/soft iron).

### 12.2 Calibration Command

Use the Command Request (0xF2) to enable/disable dynamic calibration per sensor.
Settings **do not persist** across reset. See SH-2 Reference Manual [1] for the
exact subcommand layout.

### 12.3 Calibration Procedure

| Sensor | Procedure |
|--------|-----------|
| Accelerometer (3D) | Hold device in 4–6 unique orientations, ~1 s each |
| Accelerometer (planar) | Rotate around Z-axis ≥ 180° (RVC apps) |
| Gyroscope | Place stationary on a stable surface for 2–3 s |
| Magnetometer | Rotate ~180° and back on each of roll/pitch/yaw, ~2 s each |

Defaults: accel and mag calibration enabled in all modes except UART-RVC.
UART-RVC enables planar-ZGO accel calibration by default.

For VR/AR head tracking, prefer Game Rotation Vector or Gyro Rotation Vector and
disable mag calibration to avoid heading jumps.

### 12.4 Persisting Dynamic Calibration

DCD is auto-saved to RAM every 5 s. On non-power-up reset, the last RAM copy is
written to FRS. Use the **Clear-DCD and Reset** command [1] to wipe before reset.

For SHTP applications: explicit **Save DCD** request and **Configure Periodic
DCD Save** command are also available.

### 12.5 Interactive Calibration (BNO086 only)

For applications where low heading drift is critical, the BNO086 supports a
cooperative calibration mode where the host application coordinates ZRO updates.
See SH-2 Reference Manual.

---

## 13. Environmental Sensors

Supported on the secondary I²C bus (`ENV_SCL`/`ENV_SDA`):

- Bosch BME280 (pressure / humidity / temperature)
- Bosch BMP280 (pressure / temperature) — populate either BME280 or BMP280, not both
- Capella CM36686 (proximity / ALS)

The BNO probes this bus at reset, so pull-ups are required even if no env
sensors are present. ALS/proximity typically need calibration when mounted
behind glass/plastic.

---

## 14. Bootloader / DFU

- Entered when `BOOTN` is low at reset/power-on
- Uses the same interface as selected by PS1/PS0 (I²C/SPI/UART; UART-RVC reserved)
- I²C bootloader address: `0x28` or `0x29` (SA0)
- Workflow: host sends application size, then frames; BNO reports per-frame
  status; host verifies and exits bootloader by deasserting BOOTN and resetting.
- Reference DFU host code is available from CEVA on request.

---

## 15. Electrical & Timing (Summary)

> Detailed AC curves are omitted — see the full datasheet for production-grade
> values. The numbers below are sufficient for driver bring-up.

### 15.1 Power
- VDD: 2.4–3.6 V (sensor supply)
- VDDIO: 1.65–3.6 V (core/IO)
- **VDD must come up before or at the same time as VDDIO**
- Operating temp: −40 °C to +85 °C

### 15.2 Logic Levels
- VIH: 0.7 × VDDIO (≤2.7 V) or 0.55 × VDDIO (>2.7 V)
- VIL: 0.25 × VDDIO (≤2.7 V) or 0.30 × VDDIO (>2.7 V)
- VOH ≥ 0.8 × VDDIO at 10 mA
- VOL ≤ 0.2 × VDDIO at 20 mA

### 15.3 Timing Highlights
- I²C: up to 400 kHz, master must support clock stretching
- SPI: up to 3 MHz, mode 3
- UART-SHTP: 3 Mbps, 8N1, ≥100 µs gap between host→BNO bytes
- UART-RVC: 115200 bps, 8N1
- Reset (NRST) pulse ≥ 10 ns
- Internal init after reset: ~90 ms before `H_INTN` first asserts
- Internal config: +4 ms typ
- SPI WAKE: ~150 µs from PS0/WAKE assertion to `H_INTN`
- I²C addr-recognized to `H_INTN` deassert: ~10 µs
- SPI `H_CSN` to `H_INTN` deassert: ~800 ns
- UART `H_INTN` assert to first TX bit: ~7.7 µs

### 15.4 Power Consumption (typical, SPI, VDDIO=3 V, VDD=3.3 V)

**BNO086 (lower power)**
| Configuration | VDDIO mA | VDD mA | Total mW |
|---------------|----------|--------|----------|
| Idle | 0.047 | 0.01 | 0.17 |
| Gyro RV @ 1000 Hz | 6.84 | 7.50 | 45.27 |
| Sensor Fusion @ 100 Hz | 3.18 | 7.50 | 34.29 |
| Calibrated Gyro @ 100 Hz | 2.92 | 7.50 | 33.51 |
| Geomagnetic RV @ 100 Hz | 2.11 | 4.70 | 21.84 |
| Calibrated Accel @ 125 Hz | 0.98 | 0.15 | 3.44 |
| Significant Motion | 0.34 | 0.14 | 1.66 |
| Step Counter | 0.36 | 0.14 | 1.54 |
| Tap Detector | 0.05 | 0.15 | 0.65 |
| Stability Detector | 0.05 | 0.01 | 0.18 |

(BNO085 numbers are similar but with slightly higher idle / detector currents.)

---

## 16. Performance Characteristics (Typical)

| Output | Dynamic accuracy | Static accuracy |
|--------|------------------|-----------------|
| Rotation Vector | 3.5° | 2.0° |
| Game Rotation Vector | 2.5° (non-heading) + 0.5°/min heading drift | 1.5° (non-heading) |
| Geomagnetic Rotation Vector | 4.5° | 3.0° |
| Gravity | — | 1.5° |
| Linear Acceleration | 0.35 m/s² | — |
| Accelerometer | 0.3 m/s² | — |
| Gyroscope | 3.1°/s | — |
| Magnetometer | 1.4 µT | — |

Real-world rotation vector accuracy is typically ~5°; geomagnetic ~10°
(highly dependent on local magnetic environment).

---

## 17. Driver Bring-up Checklist (Zephyr-relevant)

1. **Strap pins** correctly at reset:
   - I²C: PS1=0, PS0=0
   - SPI: PS1=1, PS0=1 (PS0 then becomes WAKE)
   - UART-SHTP: PS1=1, PS0=0
   - UART-RVC: PS1=0, PS0=1
   - BOOTN = 1 for normal app, 0 for DFU
   - CLKSEL0/1 per clock source
2. **Reset and wait** for `H_INTN` low (~94 ms after NRST deasserts).
3. **Read SHTP advertisement** (channel 0 broadcast).
4. **Read reset notifications** from channel 1 (executable) and channel 2 (SH-2 init).
5. **Send Product ID Request (0xF9)** to confirm part identity and firmware version.
6. **(Optional) Configure system orientation** via FRS 0x2D3E.
7. **Enable sensors** with Set Feature (0xFD) on channel 2:
   - Pick a Report ID for the desired output
   - Set Report Interval (µs)
   - Set Batch Interval (0 = no batching)
   - Set Feature Flags (e.g., wake bit if needed)
8. **Service `H_INTN`** within 1/10 of the fastest sensor period; read reports
   from channels 3 / 4 / 5 depending on configuration.
9. **Timestamp** using Timebase Reference (0xFB) + per-report delay.
10. **For SPI**: pulse PS0/WAKE low whenever the host wants to push a message
    while the BNO is idle; wait for `H_INTN` then assert CS.
11. **For BNO086 I²C polling** with no data → ignore zero-length packets.

---

## 18. Important Software References

These are the canonical CEVA documents — consult them for full register/command
detail beyond what is summarized here:

1. **1000-3625 — SH-2 Reference Manual** (full report ID and command layouts)
2. **1000-3535 — Sensor Hub Transfer Protocol** (SHTP framing, fragmentation)
3. Android Sensors HAL Overview (Google) — sensor-type definitions
4. NXP UM10204 — I²C-bus specification
5. Bosch BMF055 datasheet — underlying MEMS / package details
6. BNO055 handling, soldering & mounting instructions (Bosch)
7. **1000-4044 — BNO08X Sensor Calibration Procedure**
8. **1000-4045 — BNO08X Tare Function Usage Guide**

---

## 19. Source

Condensed from CEVA's *BNO08X Datasheet* (document 1000-3927, revision 1.17,
dated 2023-07-24). © 2023 CEVA, Inc. — see original document for legal notices.
