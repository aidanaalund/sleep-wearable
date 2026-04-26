# ADS1299, ADS1299-4, ADS1299-6 — Datasheet

**ADS1299-x Low-Noise, 4-, 6-, 8-Channel, 24-Bit, Analog-to-Digital Converter for EEG and Biopotential Measurements**

*Texas Instruments — SBAS499C, July 2012, revised January 2017*

> Text extracted from the ADS1299 datasheet PDF. Tables and register-bit
> layouts are preserved as-is from the source. Block diagrams, pin
> diagrams, schematics, and other figures are referenced by caption only —
> see the original PDF for visuals.

---

## 1 Features

- Up to Eight Low-Noise PGAs and Eight High-Resolution Simultaneous-Sampling ADCs
- Input-Referred Noise: 1 μVPP (70-Hz BW)
- Input Bias Current: 300 pA
- Data Rate: 250 SPS to 16 kSPS
- CMRR: –110 dB
- Programmable Gain: 1, 2, 4, 6, 8, 12, or 24
- Unipolar or Bipolar Supplies:
  - Analog: 4.75 V to 5.25 V
  - Digital: 1.8 V to 3.6 V
- Built-In Bias Drive Amplifier, Lead-Off Detection, Test Signals
- Built-In Oscillator
- Internal or External Reference
- Flexible Power-Down, Standby Mode
- Pin-Compatible with the ADS129x
- SPI-Compatible Serial Interface
- Operating Temperature Range: –40°C to +85°C

## 2 Applications

- Medical Instrumentation Including:
  - Electroencephalogram (EEG) Study
  - Fetal Electrocardiography (ECG)
  - Sleep Study Monitor
  - Bispectral Index (BIS)
  - Evoked Audio Potential (EAP)

## 3 Description

The ADS1299-4, ADS1299-6, and ADS1299 devices are a family of four-, six-, and eight-channel, low-noise, 24-bit, simultaneous-sampling delta-sigma (ΔΣ) analog-to-digital converters (ADCs) with a built-in programmable gain amplifier (PGA), internal reference, and an onboard oscillator. The ADS1299-x incorporates all commonly-required features for extracranial electroencephalogram (EEG) and electrocardiography (ECG) applications. With its high levels of integration and exceptional performance, the ADS1299-x enables the creation of scalable medical instrumentation systems at significantly reduced size, power, and overall cost.

The ADS1299-x has a flexible input multiplexer per channel that can be independently connected to the internally-generated signals for test, temperature, and lead-off detection. Additionally, any configuration of input channels can be selected for derivation of the patient bias output signal. Optional SRB pins are available to route a common signal to multiple inputs for a referential montage configuration. The ADS1299-x operates at data rates from 250 SPS to 16 kSPS. Lead-off detection can be implemented internal to the device using an excitation current sink or source.

Multiple ADS1299-4, ADS1299-6, or ADS1299 devices can be cascaded in high channel count systems in a daisy-chain configuration. The ADS1299-x is offered in a TQFP-64 package specified from –40°C to +85°C.

### Device Information

| Part Number | Package  | Body Size (Nom.)        |
|-------------|----------|-------------------------|
| ADS1299-x   | TQFP (64)| 10.00 mm × 10.00 mm     |

*(See the orderable addendum at the end of the data sheet for all available packages.)*

## 4 Revision History

### Changes from Revision B (October 2016) to Revision C

- Changed *Maximum Junction* parameter name to *Junction* in *Absolute Maximum Ratings* table.
- Changed *Recommended Operating Conditions* table: changed free-air to ambient in conditions statement, changed specifications of *Input voltage* parameter, and added VCM and fCLK symbols.
- Changed conditions statement of *Electrical Characteristics* table: added TA to temperature conditions, moved DVDD condition to after AVDD – AVSS condition.
- Changed *Input bias current* parameter test conditions from input to InxP and INxN.
- Changed *Drift* parameter unit from ppm to ppm/°C and changed *Internal clock accuracy* parameter test conditions from –40°C ≤ TA ≤ +85°C to TA = –40°C to +85°C in *Electrical Characteristics* table.
- Changed IAVDD and IDVDD parameters [deleted (normal mode) from parameter names and added Normal mode to test conditions], and deleted Quiescent from *Power dissipation* parameter name in *Electrical Characteristics* table.
- Changed free-air to ambient in conditions statement of *Timing Requirements: Serial Interface* table.
- Changed *Analog Input* section.
- Changed Table 9 cross-reference to Table 7 in *Settling Time* section.
- Changed *Ideal Output Code versus Input Signal* table: changed all VREF in first column to FS in and deleted footnote 1.
- Changed reset settings of bits 4 and 3 in bit register of CONFIG1 register.
- Changed reset value settings of bits 7 to 5 in CONFIG2 register: split cells apart.
- Changed reset value settings of bits 6 to 5 in CONFIG3 register: split cells apart.
- Changed AVDD – AVSS to AVDD + AVSS in description of bit 3 in *Configuration Register 3 Field Descriptions*.
- Changed *Lead-Off Control Register Field Descriptions* table: changed 01 bit setting of bits 3:2 to 24 nA from 12 nA, changed description of bits 1:0.
- Changed *Unused Inputs and Outputs* section: added DRDY description, deleted statement of not floating unused digital inputs.
- Deleted second *Layout Guidelines* sub-section from *Layout* section.

### Changes from Revision A (August 2012) to Revision B

- Added *ESD Ratings* table, *Feature Description* section, *Device Functional Modes*, *Application and Implementation* section, *Power Supply Recommendations* section, *Layout* section, *Device and Documentation Support* section, and *Mechanical, Packaging, and Orderable Information* section.
- Added ADS1299-4 and ADS1299-6 to document.
- Deleted Low Power Features bullet.
- Changed extracranial electroencephalogram (EEG) in Applications and Description sections.
- Deleted last Applications bullet.
- Changed Description section: added sentence on SRB pins, changed last sentence of second paragraph.
- Changed ADS1299 family to ADS1299-x throughout document.
- Changed Block Diagram: added dotted boxes.
- Changed specifications for Lead-Off Detect, Frequency parameter of *Electrical Characteristics* table.
- Added specifications for ADS1299-4 and ADS1299-6 in *Supply Current (Bias Turned Off)* and *Power Dissipation (Analog Supply = 5 V, Bias Amplifiers Turned Off)* sections of *Electrical Characteristics* table.
- Changed *Noise Measurements* section.
- Changed Functional Block Diagram to show channels 5-8 not covered in ADS1299-4 and channels 7-8 not covered in ADS1299-6.
- Changed INxP and INxN pins in Figure 18.
- Changed Figure 23: changed PgaP, PgaN to PGAp, PGAn.
- Changed *Input Common-Mode Range* section: changed input common-mode range description.
- Changed differential input voltage range in the *Input Differential Dynamic Range* section.
- Changed Figure 34: MUX8[2:0] = 010 on IN8N, and BIAS_MEAS = 1 on BIASIN.
- Changed first sentence of second paragraph in *Lead-Off Detection* section.
- Changed *AC Lead-Off (One Time or Periodic)* section.
- Changed *Bias Lead-Off* section.
- Changed title of Figure 38 and power-down description in *Bias Drive (DC Bias Circuit)* section.
- Changed START Opcode to START in Figure 39.
- Changed *Reset (RESET)* section for clarity.
- Changed title, first paragraph, START Opcode and STOP Opcode to START and STOP (Figure 42), and STOP Opcode to STOP Command (Figure 43) in *Continuous Conversion Mode* section.
- Added last sentence to *Data Input (DIN)* section.
- Added cross-reference to the *Sending Multi-Byte Commands* section in *RDATAC: Read Data Continuous* section.
- Changed RDATAC Opcode to RDATAC in Figure 46.
- Changed RDATA Opcode to RDATA in Figure 46.
- Changed description of SCLK rate restrictions, OPCODE 1 and OPCODE 2 to BYTE 1 and BYTE 2 in Figure 48 of *RREG: Read From Register* section.
- Changed footnotes 1 and 2 and added more cross-references to footnotes in rows 0Dh to 11h in Table 11.
- Changed register description and description of bit 5 in *MISC1: Miscellaneous 1 Register* section.
- Changed output names in Figure 68 from RA, LA, and RL to Electrode 1, Electrode 2, and BIAS Electrode, respectively.
- Changed *Power-Up Sequencing* section.

### Changes from Original (July 2012) to Revision A

- Changed product column of Family and Ordering Information table.

## 5 Device Comparison

| Product   | Package Options | Operating Temperature Range | Channels | ADC Resolution | Maximum Sampling Rate |
|-----------|-----------------|-----------------------------|----------|----------------|-----------------------|
| ADS1299-4 | TQFP-64         | –40°C to +85°C              | 4        | 24             | 16 kSPS               |
| ADS1299-6 | TQFP-64         | –40°C to +85°C              | 6        | 24             | 16 kSPS               |
| ADS1299   | TQFP-64         | –40°C to +85°C              | 8        | 24             | 16 kSPS               |

## 6 Pin Configuration and Functions

**Package: PAG (64-Pin TQFP), Top View** — see PDF Figure for pin-out diagram.

### Pin Functions

Notes:
1. Set the two-state mode setting pins high to DVDD or low to DGND through ≥10-kΩ resistors.
2. Connect unused analog inputs directly to AVDD.

| Name      | No.            | Type                 | Description |
|-----------|----------------|----------------------|-------------|
| AVDD      | 19, 21, 22, 56, 59 | Supply           | Analog supply. Connect a 1-μF capacitor to AVSS. |
| AVDD      | 59             | Supply               | Charge pump analog supply. Connect a 1-μF capacitor to AVSS, pin 58. |
| AVDD1     | 54             | Supply               | Analog supply. Connect a 1-μF capacitor to AVSS1. |
| AVSS      | 20, 23, 32, 57 | Supply               | Analog ground |
| AVSS      | 58             | Supply               | Analog ground for charge pump |
| AVSS1     | 53             | Supply               | Analog ground |
| BIASIN    | 62             | Analog input         | Bias drive input to MUX |
| BIASINV   | 61             | Analog input/output  | Bias drive inverting input |
| BIASOUT   | 63             | Analog output        | Bias drive output |
| BIASREF   | 60             | Analog input         | Bias drive noninverting input |
| CS        | 39             | Digital input        | Chip select, active low |
| CLK       | 37             | Digital input        | Master clock input |
| CLKSEL    | 52             | Digital input        | Master clock select (1) |
| DAISY_IN  | 41             | Digital input        | Daisy-chain input |
| DGND      | 33, 49, 51     | Supply               | Digital ground |
| DIN       | 34             | Digital input        | Serial data input |
| DOUT      | 43             | Digital output       | Serial data output |
| DRDY      | 47             | Digital output       | Data ready, active low |
| DVDD      | 48, 50         | Supply               | Digital power supply. Connect a 1-μF capacitor to DGND. |
| GPIO1     | 42             | Digital input/output | General-purpose input/output pin 1. Connect to DGND with a ≥10-kΩ resistor if unused. |
| GPIO2     | 44             | Digital input/output | General-purpose input/output pin 2. Connect to DGND with a ≥10-kΩ resistor if unused. |
| GPIO3     | 45             | Digital input/output | General-purpose input/output pin 3. Connect to DGND with a ≥10-kΩ resistor if unused. |
| GPIO4     | 46             | Digital input/output | General-purpose input/output pin 4. Connect to DGND with a ≥10-kΩ resistor if unused. |
| IN1N      | 15             | Analog input         | Differential analog negative input 1 (2) |
| IN1P      | 16             | Analog input         | Differential analog positive input 1 (2) |
| IN2N      | 13             | Analog input         | Differential analog negative input 2 (2) |
| IN2P      | 14             | Analog input         | Differential analog positive input 2 (2) |
| IN3N      | 11             | Analog input         | Differential analog negative input 3 (2) |
| IN3P      | 12             | Analog input         | Differential analog positive input 3 (2) |
| IN4N      | 9              | Analog input         | Differential analog negative input 4 (2) |
| IN4P      | 10             | Analog input         | Differential analog positive input 4 (2) |
| IN5N      | 7              | Analog input         | Differential analog negative input 5 (2) (ADS1299-6 and ADS1299 only) |
| IN5P      | 8              | Analog input         | Differential analog positive input 5 (2) (ADS1299-6 and ADS1299 only) |
| IN6N      | 5              | Analog input         | Differential analog negative input 6 (2) (ADS1299-6 and ADS1299 only) |
| IN6P      | 6              | Analog input         | Differential analog positive input 6 (2) (ADS1299-6 and ADS1299 only) |
| IN7N      | 3              | Analog input         | Differential analog negative input 7 (2) (ADS1299 only) |
| IN7P      | 4              | Analog input         | Differential analog positive input 7 (2) (ADS1299 only) |
| IN8N      | 1              | Analog input         | Differential analog negative input 8 (2) (ADS1299 only) |
| IN8P      | 2              | Analog input         | Differential analog positive input 8 (2) (ADS1299 only) |
| NC        | 27, 29         | —                    | No connection, leave as open circuit |
| Reserved  | 64             | Analog output        | Reserved for future use, leave as open circuit |
| RESET     | 36             | Digital input        | System reset, active low |
| RESV1     | 31             | Digital input        | Reserved for future use, connect directly to DGND |
| SCLK      | 40             | Digital input        | Serial clock input |
| SRB1      | 17             | Analog input/output  | Patient stimulus, reference, and bias signal 1 |
| SRB2      | 18             | Analog input/output  | Patient stimulus, reference, and bias signal 2 |
| START     | 38             | Digital input        | Synchronization signal to start or restart a conversion |
| PWDN      | 35             | Digital input        | Power-down, active low |
| VCAP1     | 28             | Analog output        | Analog bypass capacitor pin. Connect a 100-μF capacitor to AVSS. |
| VCAP2     | 30             | Analog output        | Analog bypass capacitor pin. Connect a 1-μF capacitor to AVSS. |
| VCAP3     | 55             | Analog output        | Analog bypass capacitor pin. Connect a parallel combination of 1-μF and 0.1-μF capacitors to AVSS. |
| VCAP4     | 26             | Analog output        | Analog bypass capacitor pin. Connect a 1-μF capacitor to AVSS. |
| VREFN     | 25             | Analog input         | Negative analog reference voltage. |
| VREFP     | 24             | Analog input/output  | Positive analog reference voltage. Connect a minimum 10-μF capacitor to VREFN. |

## 7 Specifications

### 7.1 Absolute Maximum Ratings

Notes:
1. Stresses beyond those listed under Absolute Maximum Ratings may cause permanent damage to the device. These are stress ratings only, which do not imply functional operation of the device at these or any other conditions beyond those indicated under Recommended Operating Conditions. Exposure to absolute-maximum-rated conditions for extended periods may affect device reliability.
2. Input pins are diode-clamped to the power-supply rails. Limit the input current to 10 mA or less if the analog input voltage exceeds AVDD + 0.3 V or is less than AVSS – 0.3 V, or if the digital input voltage exceeds DVDD + 0.3 V or is less than DGND – 0.3 V.

| Parameter | Min | Max | Unit |
|-----------|-----|-----|------|
| AVDD to AVSS | –0.3 | 5.5 | V |
| DVDD to DGND | –0.3 | 3.9 | V |
| AVSS to DGND | –3 | 0.2 | V |
| VREFP to AVSS | –0.3 | AVDD + 0.3 | V |
| VREFN to AVSS | –0.3 | AVDD + 0.3 | V |
| Analog input | AVSS – 0.3 | AVDD + 0.3 | V |
| Digital input | DGND – 0.3 | DVDD + 0.3 | V |
| Current input, continuous, any pin except power supply pins | –10 | 10 | mA |
| Junction temperature, TJ | | 150 | °C |
| Storage temperature, Tstg | –60 | 150 | °C |

### 7.2 ESD Ratings

| Parameter | Value | Unit |
|-----------|-------|------|
| V(ESD) Electrostatic discharge — Human-body model (HBM), per ANSI/ESDA/JEDEC JS-001 | ±1000 | V |
| V(ESD) Electrostatic discharge — Charged-device model (CDM), per JEDEC specification JESD22-C101 | ±500 | V |

Notes:
1. JEDEC document JEP155 states that 500-V HBM allows safe manufacturing with a standard ESD control process.
2. JEDEC document JEP157 states that 250-V CDM allows safe manufacturing with a standard ESD control process.

### 7.3 Recommended Operating Conditions

Over operating ambient temperature range (unless otherwise noted).

**Power Supply**

| Parameter | Description | Min | Nom | Max | Unit |
|-----------|-------------|-----|-----|-----|------|
| Analog power supply | AVDD to AVSS | 4.75 | 5 | 5.25 | V |
| Digital power supply | DVDD to DGND | 1.8 | 1.8 | 3.6 | V |
| Analog to Digital supply | AVDD – DVDD | –2.1 | | 3.6 | V |

**Analog Inputs**

| Parameter | Description | Value | Unit |
|-----------|-------------|-------|------|
| Full-scale differential input voltage | VINxP – VINxN | ±VREF / gain | V |
| VCM Input common-mode range | (VINxP + VINxN) / 2 | See the Input Common-Mode Range subsection of the PGA Settings and Input Range section | |

**Voltage Reference Inputs**

| Parameter | Description | Value | Unit |
|-----------|-------------|-------|------|
| VREF Reference input voltage | VREF = (VVREFP – VVREFN) | 4.5 | V |
| VREFN Negative input | | AVSS | V |
| VREFP Positive input | | AVSS + 4.5 | V |

**Clock Input**

| Parameter | Description | Min | Nom | Max | Unit |
|-----------|-------------|-----|-----|-----|------|
| fCLK External clock input frequency | CLKSEL pin = 0 | 1.5 | 2.048 | 2.25 | MHz |

**Digital Inputs**

| Parameter | Min | Max | Unit |
|-----------|-----|-----|------|
| Input voltage | DGND – 0.1 | DVDD + 0.1 | V |

**Temperature Range**

| Parameter | Min | Max | Unit |
|-----------|-----|-----|------|
| TA Operating temperature range | –40 | 85 | °C |

### 7.4 Thermal Information

| Thermal Metric | ADS1299-4, ADS1299-6, ADS1299 PAG (TQFP) 64 Pins | Unit |
|----------------|--------------------------------------------------|------|
| RθJA Junction-to-ambient thermal resistance | 46.2 | °C/W |
| RθJC(top) Junction-to-case (top) thermal resistance | 5.8 | °C/W |
| RθJB Junction-to-board thermal resistance | 19.6 | °C/W |
| ψJT Junction-to-top characterization parameter | 0.2 | °C/W |
| ψJB Junction-to-board characterization parameter | 19.2 | °C/W |
| RθJC(bot) Junction-to-case (bottom) thermal resistance | n/a | °C/W |

### 7.5 Electrical Characteristics

Minimum and maximum specifications apply from TA = –40°C to 85°C. Typical specifications are at TA = +25°C. All specifications are at AVDD – AVSS = 5 V, DVDD = 3.3 V, VREF = 4.5 V, external fCLK = 2.048 MHz, data rate = 250 SPS, and gain = 12 (unless otherwise noted).

**Analog Inputs**

| Parameter | Test Conditions | Min | Typ | Max | Unit |
|-----------|-----------------|-----|-----|-----|------|
| Input capacitance | | | 20 | | pF |
| Input bias current | TA = +25°C, InxP and INxN = 2.5 V | | ±300 | | pA |
| Input bias current | TA = –40°C to +85°C, InxP and INxN = 2.5 V | | ±300 | | pA |
| DC input impedance | No lead-off | | 1000 | | MΩ |
| DC input impedance | Current source lead-off detection (ILEADOFF = 6 nA) | | 500 | | MΩ |

**PGA Performance**

| Parameter | Value |
|-----------|-------|
| Gain settings | 1, 2, 4, 6, 8, 12, 24 |
| BW Bandwidth | See Table 5 |

**ADC Performance**

| Parameter | Test Conditions | Min | Max | Unit |
|-----------|-----------------|-----|-----|------|
| Resolution | | 24 | | Bits |
| DR Data rate | fCLK = 2.048 MHz | 250 | 16000 | SPS |

**DC Channel Performance**

| Parameter | Test Conditions | Min | Typ | Max | Unit |
|-----------|-----------------|-----|-----|-----|------|
| Input-referred noise (0.01 Hz to 70 Hz) | 10 seconds of data, gain = 24 | | 1 | | μVPP |
| Input-referred noise | 250 points, 1 second of data, gain = 24, TA = +25°C | | 1 | 1.35 | μVPP |
| Input-referred noise | 250 points, 1 second of data, gain = 24, TA = –40°C to +85°C | | 1 | 1.6 | μVPP |
| INL Integral nonlinearity | Full-scale with gain = 12, best fit | | 8 | | ppm |
| Offset error | | | 60 | | μV |
| Offset error drift | | | 80 | | nV/°C |
| Gain error | Excluding voltage reference error | | 0.1 | ±0.5 | % of FS |
| Gain drift | Excluding voltage reference drift | | 3 | | ppm/°C |
| Gain match between channels | | | 0.2 | | % of FS |

**AC Channel Performance**

| Parameter | Test Conditions | Min | Typ | Unit |
|-----------|-----------------|-----|-----|------|
| CMRR Common-mode rejection ratio | fCM = 50 Hz and 60 Hz | –110 | –120 | dB |
| PSRR Power-supply rejection ratio | fPS = 50 Hz and 60 Hz | | 96 | dB |
| Crosstalk | fIN = 50 Hz and 60 Hz | | –110 | dB |
| SNR Signal-to-noise ratio | VIN = –2 dBFs, fIN = 10-Hz input, gain = 12 | | 121 | dB |
| THD Total harmonic distortion | VIN = –0.5 dBFs, fIN = 10 Hz | | –99 | dB |

**Patient Bias Amplifier**

| Parameter | Test Conditions | Typ | Unit |
|-----------|-----------------|-----|------|
| Integrated noise | BW = 150 Hz | 2 | μVRMS |
| Gain bandwidth product | 50-kΩ \|\| 10-pF load, gain = 1 | 100 | kHz |
| Slew rate | 50-kΩ \|\| 10-pF load, gain = 1 | 0.07 | V/μs |
| THD Total harmonic distortion | fIN = 10 Hz, gain = 1 | –80 | dB |
| Common-mode input range | | AVSS + 0.3 to AVDD – 0.3 | V |
| Short-circuit current | | 1.1 | mA |
| Quiescent power consumption | | 20 | μA |

**Lead-Off Detect**

| Parameter | Test Conditions | Value | Unit |
|-----------|-----------------|-------|------|
| Frequency, Continuous | At dc, fDR / 4, see Register Maps for settings | | Hz |
| Frequency, One time or periodic | | 7.8, 31.2 | Hz |
| Current, ILEAD_OFF[1:0] = 00 | | 6 | nA |
| Current, ILEAD_OFF[1:0] = 01 | | 24 | nA |
| Current, ILEAD_OFF[1:0] = 10 | | 6 | μA |
| Current, ILEAD_OFF[1:0] = 11 | | 24 | μA |
| Current accuracy | | ±20% | |
| Comparator threshold accuracy | | ±30 | mV |

**External Reference**

| Parameter | Typ | Unit |
|-----------|-----|------|
| Input impedance | 5.6 | kΩ |

**Internal Reference**

| Parameter | Test Conditions | Typ | Unit |
|-----------|-----------------|-----|------|
| VREF Internal reference voltage | | 4.5 | V |
| VREF accuracy | | ±0.2% | |
| Drift | TA = –40°C to +85°C | 35 | ppm/°C |
| Start-up time | | 150 | ms |

**System Monitors**

| Parameter | Test Conditions | Typ | Unit |
|-----------|-----------------|-----|------|
| Reading error, Analog supply | | 2% | |
| Reading error, Digital supply | | 2% | |
| Device wake up | From power-up to DRDY low | 150 | ms |
| Device wake up | STANDBY mode | 31.25 | µs |
| Temperature sensor reading, Voltage | TA = +25°C | 145 | mV |
| Temperature sensor reading, Coefficient | | 490 | μV/°C |
| Test signal, Signal frequency | See Register Maps section for settings | fCLK / 2²¹, fCLK / 2²⁰ | Hz |
| Test signal, Signal voltage | See Register Maps section for settings | ±1, ±2 | mV |
| Test signal, Accuracy | | ±2% | |

**Clock**

| Parameter | Test Conditions | Typ | Unit |
|-----------|-----------------|-----|------|
| Internal oscillator clock frequency | Nominal frequency | 2.048 | MHz |
| Internal clock accuracy | TA = +25°C | ±0.5% | |
| Internal clock accuracy | TA = –40°C to +85°C | ±2.5% | |
| Internal oscillator start-up time | | 20 | μs |
| Internal oscillator power consumption | | 120 | μW |

**Digital Input/Output (DVDD = 1.8 V to 3.6 V)**

| Parameter | Test Conditions | Min | Max | Unit |
|-----------|-----------------|-----|-----|------|
| VIH High-level input voltage | | 0.8 DVDD | DVDD + 0.1 | V |
| VIL Low-level input voltage | | –0.1 | 0.2 DVDD | V |
| VOH High-level output voltage | IOH = –500 μA | 0.9 DVDD | | V |
| VOL Low-level output voltage | IOL = +500 μA | | 0.1 DVDD | V |
| Input current | 0 V < VDigitalInput < DVDD | –10 | 10 | μA |

**Supply Current (Bias Turned Off)**

| Parameter | Device | Test Conditions | Typ | Unit |
|-----------|--------|-----------------|-----|------|
| IAVDD AVDD current | ADS1299-4 | Normal mode, AVDD – AVSS = 5 V | 4.06 | mA |
| IAVDD AVDD current | ADS1299-6 | Normal mode, AVDD – AVSS = 5 V | 5.57 | mA |
| IAVDD AVDD current | ADS1299   | Normal mode, AVDD – AVSS = 5 V | 7.14 | mA |
| IDVDD DVDD current | ADS1299-4 | Normal mode, DVDD = 3.3 V | 0.54 | mA |
| IDVDD DVDD current | ADS1299-6 | Normal mode, DVDD = 3.3 V | 0.66 | mA |
| IDVDD DVDD current | ADS1299   | Normal mode, DVDD = 3.3 V | 1.00 | mA |
| IDVDD DVDD current | ADS1299-4 | Normal mode, DVDD = 1.8 V | 0.27 | mA |
| IDVDD DVDD current | ADS1299-6 | Normal mode, DVDD = 1.8 V | 0.34 | mA |
| IDVDD DVDD current | ADS1299   | Normal mode, DVDD = 1.8 V | 0.50 | mA |

**Power Dissipation (Analog Supply = 5 V, Bias Amplifiers Turned Off)**

| Device    | Mode                            | Typ  | Max | Unit |
|-----------|---------------------------------|------|-----|------|
| ADS1299-4 | Normal mode                     | 22   | 24  | mW   |
| ADS1299-4 | Power-down                      | 10   |     | µW   |
| ADS1299-4 | Standby mode, internal reference| 5.1  |     | mW   |
| ADS1299-6 | Normal mode                     | 30   | 33  | mW   |
| ADS1299-6 | Power-down                      | 10   |     | µW   |
| ADS1299-6 | Standby mode, internal reference| 5.1  |     | mW   |
| ADS1299   | Normal mode                     | 39   | 42  | mW   |
| ADS1299   | Power-down                      | 10   |     | µW   |
| ADS1299   | Standby mode, internal reference| 5.1  |     | mW   |

### 7.6 Timing Requirements: Serial Interface

Over operating ambient temperature range (unless otherwise noted).

| Symbol | Description | 2.7 V ≤ DVDD ≤ 3.6 V Min | 2.7 V ≤ DVDD ≤ 3.6 V Max | 1.8 V ≤ DVDD ≤ 2.0 V Min | 1.8 V ≤ DVDD ≤ 2.0 V Max | Unit |
|--------|-------------|---|---|---|---|------|
| tCLK | Master clock period | 414 | 666 | 414 | 666 | ns |
| tCSSC | Delay time, CS low to first SCLK | 6 | | 17 | | ns |
| tSCLK | SCLK period | 50 | | 66.6 | | ns |
| tSPWH, L | Pulse duration, SCLK pulse duration, high or low | 15 | | 25 | | ns |
| tDIST | Setup time, DIN valid to SCLK falling edge | 10 | | 10 | | ns |
| tDIHD | Hold time, valid DIN after SCLK falling edge | 10 | | 11 | | ns |
| tCSH | Pulse duration, CS high | 2 | | 2 | | tCLK |
| tSCCS | Delay time, final SCLK falling edge to CS high | 4 | | 4 | | tCLK |
| tSDECODE | Command decode time | 4 | | 4 | | tCLK |
| tDISCK2ST | Setup time, DAISY_IN valid to SCLK rising edge | 10 | | 10 | | ns |
| tDISCK2HT | Hold time, DAISY_IN valid after SCLK rising edge | 10 | | 10 | | ns |

### 7.7 Switching Characteristics: Serial Interface

Over operating ambient temperature range (unless otherwise noted).

| Parameter | Description | 2.7 V ≤ DVDD ≤ 3.6 V Min | 2.7 V ≤ DVDD ≤ 3.6 V Max | 1.8 V ≤ DVDD ≤ 2.0 V Min | 1.8 V ≤ DVDD ≤ 2.0 V Max | Unit |
|-----------|-------------|---|---|---|---|------|
| tDOHD | Hold time, SCLK falling edge to invalid DOUT | 10 | | 10 | | ns |
| tDOPD | Propagation delay time, SCLK rising edge to DOUT valid | | 17 | | 32 | ns |
| tCSDOD | Propagation delay time, CS low to DOUT driven | | 10 | | 20 | ns |
| tCSDOZ | Propagation delay time, CS high to DOUT Hi-Z | | 10 | | 20 | ns |

*Note: SPI settings are CPOL = 0 and CPHA = 1.*

*Figure 1. Serial Interface Timing — see PDF.*
*Figure 2. Daisy-Chain Interface Timing — see PDF.*

### 7.8 Typical Characteristics

At TA = 25°C, AVDD = 5 V, AVSS = 0 V, DVDD = 3.3 V, internal VREFP = 4.5 V, VREFN = AVSS, external clock = 2.048 MHz, data rate = 250 SPS, and gain = 12 (unless otherwise noted).

The following typical-characteristic plots are included in the PDF (figures only):

- Figure 3. Input-Referred Noise
- Figure 4. Noise Histogram
- Figure 5. Common-Mode Rejection Ratio vs Frequency
- Figure 6. Leakage Current vs Input Voltage
- Figure 7. Leakage Current vs Temperature
- Figure 8. PSRR vs Frequency
- Figure 9. THD vs Frequency
- Figure 10. INL vs PGA Gain
- Figure 11. INL vs Temperature
- Figure 12. THD FFT Plot (60-Hz Signal)
- Figure 13. FFT Plot (60-Hz Signal)
- Figure 14. Offset vs PGA Gain (Absolute Value)
- Figure 15. Test Signal Amplitude Accuracy
- Figure 16. Lead-Off Comparator Threshold Accuracy
- Figure 17. Lead-Off Current Source Accuracy Distribution

## 8 Parametric Measurement Information

### 8.1 Noise Measurements

> **Note:** Unless otherwise noted, *ADS1299-x* refers to all specifications and functional descriptions of the ADS1299-4, ADS1299-6, and ADS1299.

Optimize the ADS1299-x noise performance by adjusting the data rate and PGA setting. Reduce the data rate to increase the averaging, and the noise drops correspondingly. Increase the PGA value to reduce the input-referred noise. This lowered noise level is particularly useful when measuring low-level biopotential signals. Tables 1 to 4 summarize the ADS1299-x noise performance with a 5-V analog power supply. The data are representative of typical noise performance at TA = +25°C. The data shown are the result of averaging the readings from multiple devices and are measured with the inputs shorted together. A minimum of 1000 consecutive readings are used to calculate the RMS and peak-to-peak noise for each reading. For the lower data rates, the ratio is approximately 6.6.

Table 1 shows measurements taken with an internal reference. The data are also representative of the ADS1299-x noise performance when using a low-noise external reference such as the REF5045.

Tables 1, 2, 3, and 4 list the input-referred noise in units of μVRMS and μVPP for the conditions shown. The corresponding data in units of effective number of bits (ENOB) where ENOB for the RMS noise is defined as in Equation 1:

```
ENOB = log2( VREF / (sqrt(2) × Gain × VRMS) )                          (1)
```

Noise-free bits for the peak-to-peak noise are calculated with the same method.

The dynamic range data in Tables 1, 2, 3, and 4 are calculated using Equation 2:

```
Dynamic Range = 20 × log( VREF / (sqrt(2) × Gain × VRMS) )             (2)
```

#### Table 1. Input-Referred Noise (μVRMS, μVPP) in Normal Mode — 5-V Analog Supply and 4.5-V Reference

| DR Bits CONFIG1 | Output Data Rate (SPS) | –3-dB BW (Hz) | Gain=1 μVRMS | Gain=1 μVPP | Gain=1 DR (dB) | Gain=1 NF Bits | Gain=1 ENOB | Gain=2 μVRMS | Gain=2 μVPP | Gain=2 DR (dB) | Gain=2 NF Bits | Gain=2 ENOB |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 000 | 16000 | 4193 | 21.70 | 151.89 | 103.3 | 15.85 | 17.16 | 10.85 | 75.94 | 103.3 | 15.85 | 17.16 |
| 001 | 8000 | 2096 | 6.93 | 48.53 | 113.2 | 17.50 | 18.81 | 3.65 | 25.52 | 112.8 | 17.43 | 18.74 |
| 010 | 4000 | 1048 | 4.33 | 30.34 | 117.3 | 18.18 | 19.49 | 2.28 | 15.95 | 116.9 | 18.11 | 19.41 |
| 011 | 2000 | 524 | 3.06 | 21.45 | 120.3 | 18.68 | 19.99 | 1.61 | 11.29 | 119.9 | 18.60 | 19.91 |
| 100 | 1000 | 262 | 2.17 | 15.17 | 123.3 | 19.18 | 20.49 | 1.14 | 7.98 | 122.9 | 19.10 | 20.41 |
| 101 | 500 | 131 | 1.53 | 10.73 | 126.3 | 19.68 | 20.99 | 0.81 | 5.65 | 125.9 | 19.60 | 20.91 |
| 110 | 250 | 65 | 1.08 | 7.59 | 129.3 | 20.18 | 21.48 | 0.57 | 3.99 | 128.9 | 20.10 | 21.41 |
| 111 | n/a | n/a | — | — | — | — | — | — | — | — | — | — |

#### Table 2. Input-Referred Noise — Gain = 4 and Gain = 6

| DR Bits | Data Rate (SPS) | –3-dB BW (Hz) | G=4 μVRMS | G=4 μVPP | G=4 DR (dB) | G=4 NFB | G=4 ENOB | G=6 μVRMS | G=6 μVPP | G=6 DR (dB) | G=6 NFB | G=6 ENOB |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 000 | 16000 | 4193 | 5.60 | 39.23 | 103.0 | 15.81 | 17.12 | 3.87 | 27.10 | 102.7 | 15.76 | 17.06 |
| 001 | 8000 | 2096 | 1.98 | 13.87 | 112.1 | 17.31 | 18.62 | 1.31 | 9.19 | 112.1 | 17.32 | 18.62 |
| 010 | 4000 | 1048 | 1.24 | 8.66 | 116.1 | 17.99 | 19.29 | 0.93 | 6.50 | 115.1 | 17.82 | 19.12 |
| 011 | 2000 | 524 | 0.88 | 6.13 | 119.2 | 18.49 | 19.79 | 0.66 | 4.60 | 118.1 | 18.32 | 19.62 |
| 100 | 1000 | 262 | 0.62 | 4.34 | 122.2 | 18.99 | 20.29 | 0.46 | 3.25 | 121.1 | 18.81 | 20.12 |
| 101 | 500 | 131 | 0.44 | 3.07 | 125.2 | 19.49 | 20.79 | 0.33 | 2.30 | 124.1 | 19.31 | 20.62 |
| 110 | 250 | 65 | 0.31 | 2.16 | 128.2 | 19.99 | 21.30 | 0.23 | 1.62 | 127.2 | 19.82 | 21.13 |
| 111 | n/a | n/a | — | — | — | — | — | — | — | — | — | — |

#### Table 3. Input-Referred Noise — Gain = 8 and Gain = 12

| DR Bits | Data Rate (SPS) | –3-dB BW (Hz) | G=8 μVRMS | G=8 μVPP | G=8 DR (dB) | G=8 NFB | G=8 ENOB | G=12 μVRMS | G=12 μVPP | G=12 DR (dB) | G=12 NFB | G=12 ENOB |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 000 | 16000 | 4193 | 3.05 | 21.32 | 102.3 | 15.69 | 16.99 | 2.27 | 15.89 | 101.3 | 15.53 | 16.83 |
| 001 | 8000 | 2096 | 1.11 | 7.80 | 111.0 | 17.14 | 18.45 | 0.92 | 6.41 | 109.2 | 16.84 | 18.14 |
| 010 | 4000 | 1048 | 0.79 | 5.52 | 114.0 | 17.64 | 18.95 | 0.65 | 4.53 | 112.2 | 17.34 | 18.64 |
| 011 | 2000 | 524 | 0.56 | 3.90 | 117.1 | 18.14 | 19.44 | 0.46 | 3.20 | 115.2 | 17.84 | 19.14 |
| 100 | 1000 | 262 | 0.39 | 2.76 | 120.1 | 18.64 | 19.94 | 0.32 | 2.26 | 118.3 | 18.34 | 19.65 |
| 101 | 500 | 131 | 0.28 | 1.95 | 123.1 | 19.14 | 20.44 | 0.23 | 1.61 | 121.2 | 18.83 | 20.14 |
| 110 | 250 | 65 | 0.20 | 1.38 | 126.1 | 19.64 | 20.95 | 0.16 | 1.13 | 124.3 | 19.34 | 20.65 |
| 111 | n/a | n/a | — | — | — | — | — | — | — | — | — | — |

#### Table 4. Input-Referred Noise — Gain = 24

| DR Bits | Data Rate (SPS) | –3-dB BW (Hz) | μVRMS | μVPP | DR (dB) | NF Bits | ENOB |
|---|---|---|---|---|---|---|---|
| 000 | 16000 | 4193 | 1.66 | 11.64 | 98.0 | 14.98 | 16.28 |
| 001 | 8000 | 2096 | 0.80 | 5.57 | 104.4 | 16.04 | 17.35 |
| 010 | 4000 | 1048 | 0.56 | 3.94 | 107.4 | 16.54 | 17.84 |
| 011 | 2000 | 524 | 0.40 | 2.79 | 110.4 | 17.04 | 18.35 |
| 100 | 1000 | 262 | 0.28 | 1.97 | 113.5 | 17.54 | 18.85 |
| 101 | 500 | 131 | 0.20 | 1.39 | 116.5 | 18.04 | 19.35 |
| 110 | 250 | 65 | 0.14 | 0.98 | 119.5 | 18.54 | 19.85 |
| 111 | n/a | n/a | — | — | — | — | — |

## 9 Detailed Description

### 9.1 Overview

The ADS1299-x is a low-noise, low-power, multichannel, simultaneously-sampling, 24-bit, delta-sigma (ΔΣ) analog-to-digital converter (ADC) with an integrated programmable gain amplifier (PGA). These devices integrate various EEG-specific functions that makes the family well-suited for scalable electrocardiogram (ECG), electroencephalography (EEG) applications. These devices can also be used in high-performance, multichannel, data acquisition systems by powering down the ECG or EEG-specific circuitry.

The devices have a highly-programmable multiplexer that allows for temperature, supply, input short, and bias measurements. Additionally, the multiplexer allows any input electrodes to be programmed as the patient reference drive. The PGA gain can be chosen from one of seven settings (1, 2, 4, 6, 8, 12, and 24). The ADCs in the device offer data rates from 250 SPS to 16 kSPS. Communication to the device is accomplished using an SPI-compatible interface. The device provides four general-purpose input/output (GPIO) pins for general use. Multiple devices can be synchronized using the START pin.

The internal reference generates a low noise 4.5 V internal voltage when enabled and the internal oscillator generates a 2.048-MHz clock when enabled. The versatile patient bias drive block allows the average of any electrode combination to be chosen in order to generate the patient drive signal. Lead-off detection can be accomplished by using a current source or sink. A one-time, in-band, lead-off option and a continuous, out-of-band, internal lead-off option are available.

### 9.2 Functional Block Diagram

*See PDF for the full functional block diagram. The block diagram shows: VREFP/VREFN reference inputs feeding a Reference block; AVDD/AVDD1 analog supplies; DVDD digital supply; an input MUX feeding eight Low-Noise PGAs and ΔΣ ADCs (PGA1/ADC1 through PGA8/ADC8 — channels 5–8 only on ADS1299-6 and ADS1299; channels 7–8 only on ADS1299); SPI block (CS, SCLK, DIN, DOUT) with DRDY output; CLK/CLKSEL clocking with internal Oscillator; Control block with PWDN, RESET, START; four GPIO pins; BIAS amplifier with BIASIN, BIASREF, BIASOUT, BIASINV pins; SRB1 and SRB2 routing pins; test signal, temperature sensor, lead-off excitation, and supply-monitor signals routed into the MUX.*

### 9.3 Feature Description

This section contains details of the ADS1299-x internal functional elements. The analog blocks are discussed first, followed by the digital interface. Blocks implementing EEG-specific functions are covered at the end of this section.

Throughout this document, fCLK denotes the CLK pin signal frequency, tCLK denotes the CLK pin signal period, fDR denotes the output data rate, tDR denotes the output data time period, and fMOD denotes the frequency at which the modulator samples the input.

#### 9.3.1 Analog Functionality

##### 9.3.1.1 Input Multiplexer

The ADS1299-x input multiplexers are very flexible and provide many configurable signal-switching options. Figure 18 shows the multiplexer on a single channel of the device. Note that the device has either four (ADS1299-4), six (ADS1299-6) or eight (ADS1299) such blocks, one for each channel. SRB1, SRB2, and BIASIN are common to all blocks. INxP and INxN are separate for each of the four, six, or eight blocks. This flexibility allows for significant device and sub-system diagnostics, calibration, and configuration. Switch setting selections for each channel by writing the appropriate values to the CHnSET[3:0] register (see the *CHnSET: Individual Channel Settings* section for details) using the BIAS_MEAS bit in the CONFIG3 register and the SRB1 bit in the MISC1 register (see the *CONFIG3: Configuration Register 3* subsection of the *Register Maps* section for details). See the *Input Multiplexer* section for further information regarding the EEG-specific features of the multiplexer.

*Note: MAIN is equal to either MUX[2:0] = 000, MUX[2:0] = 110, or MUX[2:0] = 111.*

*Figure 18. Input Multiplexer Block for One Channel — see PDF.*

###### 9.3.1.1.1 Device Noise Measurements

Setting CHnSET[2:0] = 001 sets the common-mode voltage of [(VVREFP + VVREFN) / 2] to both channel inputs. This setting can be used to test inherent device noise in the user system.

###### 9.3.1.1.2 Test Signals (TestP and TestN)

Setting CHnSET[2:0] = 101 provides internally-generated test signals for use in sub-system verification at power-up. This functionality allows the device internal signal chain to be tested out.

Test signals are controlled through register settings (see the *CONFIG2: Configuration Register 2* subsection in the *Register Maps* section for details). TEST_AMP controls the signal amplitude and TEST_FREQ controls switching at the required frequency.

###### 9.3.1.1.3 Temperature Sensor (TempP, TempN)

The ADS1299-x contains an on-chip temperature sensor. This sensor uses two internal diodes with one diode having a current density 16x that of the other, as shown in Figure 19. The difference in diode current densities yields a voltage difference proportional to absolute temperature.

As a result of the low thermal resistance of the package to the printed circuit board (PCB), the internal device temperature tracks PCB temperature closely. Note that self-heating of the ADS1299-x causes a higher reading than the temperature of the surrounding PCB.

The scale factor of Equation 3 converts the temperature reading to degrees Celsius. Before using this equation, the temperature reading code must first be scaled to microvolts.

```
Temperature (°C) = (Temperature Reading (μV) – 145,300 μV) / (490 μV/°C) + 25°C       (3)
```

*Figure 19. Temperature Sensor Measurement in the Input — see PDF.*

###### 9.3.1.1.4 Supply Measurements (MVDDP, MVDDN)

Setting CHnSET[2:0] = 011 sets the channel inputs to different supply voltages of the device.

For channels 1, 2, 5, 6, 7, and 8, (MVDDP – MVDDN) is [0.5 × (AVDD + AVSS)].

For channels 3 and 4, (MVDDP – MVDDN) is DVDD / 4.

To avoid saturating the PGA when measuring power supplies, set the gain to 1.

###### 9.3.1.1.5 Lead-Off Excitation Signals (LoffP, LoffN)

The lead-off excitation signals are fed into the multiplexer before the switches. The comparators that detect the lead-off condition are also connected to the multiplexer block before the switches. For a detailed description of the lead-off block, see the *Lead-Off Detection* section.

###### 9.3.1.1.6 Auxiliary Single-Ended Input

The BIASIN pin is primarily used for routing the bias signal to any electrodes in case the bias electrode falls off. However, the BIASIN pin can be used as a multiple single-ended input channel. The signal at the BIASIN pin can be measured with respect to the voltage at the BIASREF pin using any of the eight channels. This measurement is done by setting the channel multiplexer setting to '010' and the BIAS_MEAS bit of the CONFIG3 register to '1'.

##### 9.3.1.2 Analog Input

The analog inputs to the device connect directly to an integrated low-noise, low-drift, high input impedance, programmable gain amplifier. The amplifier is located following the individual channel multiplexer.

The ADS1299-x analog inputs are fully differential. The differential input voltage (VINxP – VINxN) can span from –VREF / gain to VREF / gain. See the *Data Format* section for an explanation of the correlation between the analog input and digital codes. There are two general methods of driving the ADS1299-x analog inputs: pseudo-differential or fully-differential, as shown in Figures 20, 21, and 22.

*Figures 20, 21, 22 — Methods of Driving the ADS1299-x: Pseudo-Differential or Fully Differential. See PDF.*

Hold the INxN pin at a common voltage, preferably at mid supply, to configure the fully differential input for a pseudo-differential signal. Swing the INxP pin around the common voltage –VREF / gain to VREF / gain and remain within the absolute maximum specifications. The common-mode voltage (VCM) changes with varying signal level when the inputs are configured in pseudo-differential mode. Verify that the differential signal at the minimum and maximum points meets the common-mode input specification discussed in the *Input Common-Mode Range* section.

Configure the signals at INxP and INxN to be 180° out-of-phase centered around a common voltage to use a fully differential input method. Both the INxP and INxN inputs swing from the common voltage + ½ VREF / gain to the common voltage – ½ VREF / gain. The differential voltage at the maximum and minimum points is equal to –VREF / gain to VREF / gain and centered around a fixed common-mode voltage (VCM). Use the ADS1299-x in a differential configuration to maximize the dynamic range of the data converter. For optimal performance, the common voltage is recommended to be set at the midpoint of the analog supplies [(AVDD + AVSS) / 2].

##### 9.3.1.3 PGA Settings and Input Range

The low-noise PGA is a differential input and output amplifier, as shown in Figure 23. The PGA has seven gain settings (1, 2, 4, 6, 8, 12, and 24) that can be set by writing to the CHnSET register. The ADS1299-x has CMOS inputs and therefore has negligible current noise. Table 5 shows the typical bandwidth values for various gain settings. Note that Table 5 shows small-signal bandwidth. For large signals, performance is limited by PGA slew rate.

*Figure 23. PGA Implementation — see PDF.*

#### Table 5. PGA Gain versus Bandwidth

| Gain | Nominal Bandwidth at Room Temperature (kHz) |
|------|---------------------------------------------|
| 1    | 662 |
| 2    | 332 |
| 4    | 165 |
| 6    | 110 |
| 8    | 83  |
| 12   | 55  |
| 24   | 27  |

The PGA resistor string that implements the gain has 39.6 kΩ of resistance for a gain of 12. This resistance provides a current path across the PGA outputs in the presence of a differential input signal. This current is in addition to the quiescent current specified for the device in the presence of a differential signal at the input.

###### 9.3.1.3.1 Input Common-Mode Range

To stay within the linear operating range of the PGA, the input signals must meet certain requirements that are discussed in this section.

The outputs of the amplifiers in Figure 23 cannot swing closer to the supplies (AVSS and AVDD) than 200 mV. If the outputs of the amplifiers are driven to within 200 mV of the supply rails, then the amplifiers saturate and consequently become nonlinear. To prevent this nonlinear operating condition, the output voltages must not exceed the common-mode range of the front-end.

The usable input common-mode range of the front-end depends on various parameters, including the maximum differential input signal, supply voltage, PGA gain, and the 200 mV for the amplifier headroom. This range is described in Equation 4:

```
AVDD − 0.2 V − (Gain × VMAX_DIFF / 2) > CM > AVSS + 0.2 V + (Gain × VMAX_DIFF / 2)     (4)
```

Where VMAX_DIFF = maximum differential signal at the PGA input; CM = common-mode range.

For example: If AVDD = 5 V, gain = 12, and VMAX_DIFF = 350 mV, then 2.3 V < CM < 2.7 V.

###### 9.3.1.3.2 Input Differential Dynamic Range

The differential input voltage range (VINxP – VINxN) depends on the analog supply and reference used in the system:

```
Full-Scale Range = ±VREF / Gain = 2 × VREF / Gain                                       (5)
```

###### 9.3.1.3.3 ADC ΔΣ Modulator

Each ADS1299-x channel has a 24-bit, ΔΣ ADC. This converter uses a second-order modulator optimized for low-noise applications. The modulator samples the input signal at the rate of (fMOD = fCLK / 2). As in the case of any ΔΣ modulator, the device noise is shaped until fMOD / 2, as shown in Figure 24. The on-chip digital decimation filters explained in the next section can be used to filter out the noise at higher frequencies. These on-chip decimation filters also provide antialias filtering. This ΔΣ converter feature drastically reduces the complexity of the analog antialiasing filters typically required with nyquist ADCs.

*Figure 24. Modulator Noise Spectrum Up To 0.5 × fMOD — see PDF.*

###### 9.3.1.3.4 Reference

Figure 25 shows a simplified block diagram of the ADS1299-x internal reference. The 4.5-V reference voltage is generated with respect to AVSS. When using the internal voltage reference, connect VREFN to AVSS.

For VREF = 4.5 V: R1 = 9.8 kΩ, R2 = 13.4 kΩ, and R3 = 36.85 kΩ.

*Figure 25. Internal Reference — see PDF.*

The external band-limiting capacitors determine the amount of reference noise contribution. For high-end EEG systems, the capacitor values should be chosen such that the bandwidth is limited to less than 10 Hz so that the reference noise does not dominate system noise.

Alternatively, the internal reference buffer can be powered down and an external reference can be applied to VREFP. Figure 26 shows a typical external reference drive circuitry. Power-down is controlled by the PD_REFBUF bit in the CONFIG3 register. This power-down is also used to share internal references when two devices are cascaded. By default, the device wakes up in external reference mode.

*Figure 26. External Reference Driver — see PDF (uses REF5025 + OPA350).*

#### 9.3.2 Digital Functionality

##### 9.3.2.1 Digital Decimation Filter

The digital filter receives the modulator output and decimates the data stream. By adjusting the amount of filtering, tradeoffs can be made between resolution and data rate: filter more for higher resolution, filter less for higher data rates. Higher data rates are typically used in EEG applications for ac lead-off detection.

The digital filter on each channel consists of a third-order sinc filter. The sinc filter decimation ratio can be adjusted by the DR bits in the CONFIG1 register. This setting is a global setting that affects all channels and, therefore, all channels operate at the same data rate in a device.

###### 9.3.2.1.1 Sinc Filter Stage (sinx / x)

The sinc filter is a variable decimation rate, third-order, low-pass filter. Data are supplied to this section of the filter from the modulator at the rate of fMOD. The sinc filter attenuates the modulator high-frequency noise, then decimates the data stream into parallel data. The decimation rate affects the overall converter data rate.

Equation 6 shows the scaled Z-domain transfer function of the sinc filter:

```
|H(z)| = | (1 - Z^-N) / (1 - Z^-1) |^3                                                  (6)
```

The frequency domain transfer function of the sinc filter is:

```
|H(f)| = | sin(N π f / fMOD) / (N × sin(π f / fMOD)) |^3                                (7)
```

Where N = decimation ratio.

The sinc filter has notches (or zeroes) that occur at the output data rate and multiples thereof. At these frequencies, the filter has infinite attenuation. With a step change at input, the filter takes 3 × tDR to settle. After a rising edge of the START signal, the filter takes tSETTLE time to give the first data output.

*Figures 27–31 — Sinc filter frequency response, roll-off, and transfer functions at various data rates. See PDF.*

##### 9.3.2.2 Clock

The ADS1299-x provides two methods for device clocking: internal and external. Internal clocking is ideally suited for low-power, battery-powered systems. The internal oscillator is trimmed for accuracy at room temperature. Accuracy varies over the specified temperature range; see the *Electrical Characteristics*. Clock selection is controlled by the CLKSEL pin and the CLK_EN register bit.

The CLKSEL pin selects either the internal or external clock. The CLK_EN bit in the CONFIG1 register enables and disables the oscillator clock to be output in the CLK pin. A truth table for these two pins is shown in Table 6. The CLK_EN bit is useful when multiple devices are used in a daisy-chain configuration. During power-down, the external clock is recommended be shut down to save power.

#### Table 6. CLKSEL Pin and CLK_EN Bit

| CLKSEL Pin | CONFIG1.CLK_EN Bit | Clock Source            | CLK Pin Status                |
|------------|--------------------|-------------------------|-------------------------------|
| 0          | X                  | External clock          | Input: external clock         |
| 1          | 0                  | Internal clock oscillator | 3-state                     |
| 1          | 1                  | Internal clock oscillator | Output: internal clock oscillator |

##### 9.3.2.3 GPIO

The ADS1299-x has a total of four general-purpose digital I/O (GPIO) pins available in normal mode of operation. The digital I/O pins are individually configurable as either inputs or outputs through the GPIOC bits register. The GPIOD bits in the GPIO register control the pin level. When reading the GPIOD bits, the data returned are the logic level of the pins, whether they are programmed as inputs or outputs. When the GPIO pin is configured as an input, a write to the corresponding GPIOD bit has no effect. When configured as an output, a write to the GPIOD bit sets the output value.

If configured as inputs, these pins must be driven (do not float). The GPIO pins are set as inputs after power-on or after a reset. Figure 32 shows the GPIO port structure. The pins should be shorted to DGND if not used.

*Figure 32. GPIO Port Pin — see PDF.*

#### 9.3.2.4 ECG and EEG Specific Features

##### 9.3.2.4.1 Input Multiplexer (Rerouting the BIAS Drive Signal)

The input multiplexer has EEG-specific functions for the bias drive signal. The BIAS signal is available at the BIASOUT pin when the appropriate channels are selected for BIAS derivation, feedback elements are installed external to the chip, and the loop is closed. This signal can either be fed after filtering or fed directly into the BIASIN pin, as shown in Figure 33. This BIASIN signal can be multiplexed into any input electrode by setting the MUX bits of the appropriate channel set registers to '110' for P-side or '111' for N-side. Figure 33 shows the BIAS signal generated from channels 1, 2, and 3 and routed to the N-side of channel 8. This feature can be used to dynamically change the electrode that is used as the reference signal to drive the patient body.

*Figure 33. Example of BIASOUT Signal Configured to be Routed to IN8N — see PDF.*

##### 9.3.2.4.2 Input Multiplexer (Measuring the BIAS Drive Signal)

Also, the BIASOUT signal can be routed to a channel (that is not used for the calculation of BIAS) for measurement. Figure 34 shows the register settings to route the BIASIN signal to channel 8. The measurement is done with respect to the voltage on the BIASREF pin. If BIASREF is chosen to be internal, then BIASREF is at [(AVDD + AVSS) / 2]. This feature is useful for debugging purposes during product development.

*Figure 34. BIASOUT Signal Configured to be Read Back by Channel 8 — see PDF.*

##### 9.3.2.4.3 Lead-Off Detection

Patient electrode impedances are known to decay over time. These electrode connections must be continuously monitored to verify that a suitable connection is present. The ADS1299-x lead-off detection functional block provides significant flexibility to the user to choose from various lead-off detection strategies. Though called lead-off detection, this is in fact an *electrode-off* detection.

The basic principle is to inject an excitation current and measure the voltage to determine if the electrode is off. As shown in the lead-off detection functional block diagram in Figure 35, this circuit provides two different methods of determining the state of the patient electrode. The methods differ in the frequency content of the excitation signal. Lead-off can be selectively done on a per channel basis using the LOFF_SENSP and LOFF_SENSN registers. Also, the internal excitation circuitry can be disabled and just the sensing circuitry can be enabled.

*Figure 35. Lead-Off Detection — see PDF.*

###### 9.3.2.4.3.1 DC Lead-Off

In this method, the lead-off excitation is with a dc signal. The dc excitation signal can be chosen from either an external pull-up or pull-down resistor or an internal current source or sink, as shown in Figure 36. One side of the channel is pulled to supply and the other side is pulled to ground. The pull-up and pull-down current can be swapped (as shown in Figure 36b and Figure 36c) by setting the bits in the LOFF_FLIP register. In case of a current source or sink, the magnitude of the current can be set by using the ILEAD_OFF[1:0] bits in the LOFF register. The current source or sink gives larger input impedance compared to the 10-MΩ pull-up or pull-down resistor.

*Figure 36. DC Lead-Off Excitation Options — see PDF.*

Sensing of the response can be done either by searching the digital output code from the device or by monitoring the input voltages with an on-chip comparator. If either electrode is off, the pull-up and pull-down resistors saturate the channel. Searching the output code determines if either the P-side or the N-side is off. To pinpoint which one is off, the comparators must be used. The input voltage is also monitored using a comparator and a 3-bit DAC whose levels are set by the COMP_TH[2:0] bits in the LOFF register. The output of the comparators are stored in the LOFF_STATP and LOFF_STATN registers. These registers are available as a part of the output data stream. (See the *Data Output (DOUT)* subsection of the *SPI Interface* section.) If dc lead-off is not used, the lead-off comparators can be powered down by setting the PD_LOFF_COMP bit in the CONFIG4 register.

###### 9.3.2.4.3.2 AC Lead-Off (One Time or Periodic)

In this method, an in-band ac signal is used for excitation. The ac signal is generated by alternatively providing a current source and sink at the input with a fixed frequency. The frequency can be chosen by the FLEAD_OFF[1:0] bits in the LOFF register. The excitation frequency is chosen to be one of the two in-band frequency selections (7.8 Hz or 31.2 Hz). This in-band excitation signal is passed through the channel and measured at the output.

Sensing of the ac signal is done by passing the signal through the channel to be digitized and then measured at the output. The ac excitation signals are introduced at a frequency that is in the band of interest. The signal can be filtered out separately and processed. By measuring the magnitude of the output at the excitation signal frequency, the electrode impedance can be calculated.

For continuous lead-off, an out-of-band ac current source or sink must be externally applied to the inputs. This signal can then be digitally processed to determine the electrode impedance.

##### 9.3.2.4.4 Bias Lead-Off

**BIAS Lead-Off Detection During Normal Operation**

During normal operation, the ADS1299-x BIAS lead-off at power-up function cannot be used because the BIAS amplifier must be powered off.

**BIAS Lead Off Detection At Power-Up**

This feature is included in the ADS1299-x for use in determining whether the bias electrode is suitably connected. At power-up, the ADS1299-x uses a current source and comparator to determine the BIAS electrode connection status, as shown in Figure 37. The reference level of the comparator is set to determine the acceptable BIAS impedance threshold.

*Figure 37. BIAS Lead-Off Detection at Power-Up — see PDF.*

When the BIAS amplifier is powered on, the current source has no function. Only the comparator can be used to sense the voltage at the output of the BIAS amplifier. The comparator thresholds are set by the same LOFF[7:5] bits used to set the thresholds for other negative inputs.

##### 9.3.2.4.5 Bias Drive (DC Bias Circuit)

Use the bias circuitry to counter the common-mode interference in a EEG system as a result of power lines and other sources, including fluorescent lights. The bias circuit senses the common-mode voltage of a selected set of electrodes and creates a negative feedback loop by driving the body with an inverted common-mode signal. The negative feedback loop restricts the common-mode movement to a narrow range, depending on the loop gain. Stabilizing the entire loop is specific to the individual user system based on the various poles in the loop. The ADS1299-x integrates the muxes to select the channel and an operational amplifier. All the amplifier terminals are available at the pins, allowing the user to choose the components for the feedback loop. The circuit in Figure 38 shows the overall functional connectivity for the bias circuit.

*Figure 38. Bias Drive Amplifier Channel Selection — see PDF. Typical external feedback values: REXT = 1 MΩ, CEXT = 1.5 nF.*

The reference voltage for the bias drive can be chosen to be internally generated [(AVDD + AVSS) / 2] or provided externally with a resistive divider. The selection of an internal versus external reference voltage for the bias loop is defined by writing the appropriate value to the BIASREF_INT bit in the CONFIG2 register.

If the bias function is not used, the amplifier can be powered down using the PD_BIAS bit. Use the PD_BIAS bit to power-down all but one of the bias amplifiers when daisy-chaining multiple ADS1299-x devices.

The BIASIN pin functionality is explained in the *Input Multiplexer* section.

###### 9.3.2.4.5.1 Bias Configuration with Multiple Devices

Figure 39 shows multiple devices connected to the bias drive.

*Figure 39. BIAS Drive Connection for Multiple Devices — see PDF.*

## 9.4 Device Functional Modes

### 9.4.1 Start

Pull the START pin high for at least 2 tCLK periods, or send the START command to begin conversions. When START is low and the START command has not been sent, the device does not issue a DRDY signal (conversions are halted).

When using the START command to control conversions, hold the START pin low. The ADS1299-x features two modes to control conversions: continuous mode and single-shot mode. The mode is selected by SINGLE_SHOT (bit 3 of the CONFIG4 register). In multiple device configurations, the START pin is used to synchronize devices.

#### 9.4.1.1 Settling Time

The settling time (tSETTLE) is the time required for the converter to output fully-settled data when the START signal is pulled high. When START is pulled high, DRDY is also pulled high. The next DRDY falling edge indicates that data are ready. Figure 40 shows the timing diagram and Table 7 lists the settling time for different data rates. The settling time depends on fCLK and the decimation ratio (controlled by the DR[2:0] bits in the CONFIG1 register). When the initial settling time has passed, the DRDY falling edge occurs at the set data rate, tDR. If data is not read back on DOUT and the output shift register needs to update, DRDY goes high for 4 tCLK before returning back low indicating new data is ready. Note that when START is held high and there is a step change in the input signal, 3 × tDR is required for the filter to settle to the new value. Settled data are available on the fourth DRDY pulse.

*Figure 40. Settling Time — see PDF.*

#### Table 7. Settling Time for Different Data Rates

| DR[2:0] | Normal Mode (tCLK) |
|---------|--------------------|
| 000     | 521                |
| 001     | 1033               |
| 010     | 2057               |
| 011     | 4105               |
| 100     | 8201               |
| 101     | 16393              |
| 110     | 32777              |

### 9.4.2 Reset (RESET)

There are two methods to reset the ADS1299-x: pull the RESET pin low, or send the RESET command. When using the RESET pin, make sure to follow the minimum pulse duration timing specifications before taking the pin back high. The RESET command takes effect on the eighth SCLK falling edge of the command. After a reset, 18 tCLK cycles are required to complete initialization of the configuration registers to default states and start the conversion cycle. Note that an internal reset is automatically issued to the digital filter whenever the CONFIG1 register is set to a new value with a WREG command.

### 9.4.3 Power-Down (PWDN)

When PWDN is pulled low, all on-chip circuitry is powered down. To exit power-down mode, take the PWDN pin high. Upon exiting from power-down mode, the internal oscillator and the reference require time to wake up. During power-down, the external clock is recommended to be shut down to save power.

### 9.4.4 Data Retrieval

#### 9.4.4.1 Data Ready (DRDY)

DRDY is an output signal which transitions from high to low indicating new conversion data are ready. The CS signal has no effect on the data ready signal. DRDY behavior is determined by whether the device is in RDATAC mode or the RDATA command is used to read data on demand.

When reading data with the RDATA command, the read operation can overlap the next DRDY occurrence without data corruption.

The START pin or the START command places the device either in normal data capture mode or pulse data capture mode.

Figure 41 shows the relationship between DRDY, DOUT, and SCLK during data retrieval (in case of an ADS1299). DOUT is latched out at the SCLK rising edge. DRDY is pulled high at the SCLK falling edge. Note that DRDY goes high on the first SCLK falling edge, regardless of whether data are being retrieved from the device or a command is being sent through the DIN pin.

*Figure 41. DRDY with Data Retrieval (CS = 0) — see PDF.*

#### 9.4.4.2 Reading Back Data

Data retrieval can be accomplished in one of two methods:

1. **RDATAC**: the read data continuous command sets the device in a mode that reads data continuously without sending commands.
2. **RDATA**: the read data command requires that a command is sent to the device to load the output shift register with the latest data.

Conversion data are read by shifting data out on DOUT. The MSB of the data on DOUT is clocked out on the first SCLK rising edge. DRDY returns high on the first SCLK falling edge. DIN should remain low for the entire read operation.

The number of bits in the data output depends on the number of channels and the number of bits per channel. For the 8-channel ADS1299, the number of data outputs is [(24 status bits + 24 bits × 8 channels) = 216 bits]. The format of the 24 status bits is: (1100 + LOFF_STATP + LOFF_STATN + bits[4:7] of the GPIO register). The data format for each channel data are twos complement and MSB first. When channels are powered down using the user register setting, the corresponding channel output is set to '0'. However, the channel output sequence remains the same.

The ADS1299-x also provides a multiple readback feature. Data can be read out multiple times by simply giving more SCLKs in RDATAC mode, in which case the MSB data byte repeats after reading the last byte. The DAISY_EN bit in the CONFIG1 register must be set to '1' for multiple readbacks.

### 9.4.5 Continuous Conversion Mode

Conversions begin when the START pin is taken high or when the START command is sent. As shown in Figure 42, the DRDY output goes high when conversions are started and goes low when data are ready. Conversions continue indefinitely until the START pin is taken low or the STOP command is transmitted. When the START pin is pulled low or the STOP command is issued, the conversion in progress is allowed to complete.

Figure 43 and Table 8 illustrate the required DRDY timing to the START pin or the START and STOP commands when controlling conversions in this mode. The tSDSU timing indicates when to take the START pin low or when to send the STOP command before the DRDY falling edge to halt further conversions. The tDSHD timing indicates when to take the START pin low or send the STOP command after a DRDY falling edge to complete the current conversion and halt further conversions. To keep the converter running continuously, the START pin can be permanently tied high.

When switching from Single-Shot mode to Continuous Conversion mode, bring the START signal low and back high or send a STOP command followed by a START command. This conversion mode is ideal for applications that require a fixed continuous stream of conversions results.

*Figures 42, 43 — Continuous conversion mode and START to DRDY timing. See PDF.*

#### Table 8. Timing Characteristics for Figure 43

*START and STOP commands take effect on the seventh SCLK falling edge at the end of the command.*

| Symbol | Description | Min | Unit |
|--------|-------------|-----|------|
| tSDSU  | START pin low or STOP command to DRDY setup time to halt further conversions | 16 | tCLK |
| tDSHD  | START pin low or STOP command to complete current conversion | 16 | tCLK |

### 9.4.6 Single-Shot Mode

Single-shot mode is enabled by setting the SINGLE_SHOT bit in the CONFIG4 register to '1'. In single-shot mode, the ADS1299-x performs a single conversion when the START pin is taken high or when the START command is sent. As shown in Figure 44, when a conversion is complete, DRDY goes low and further conversions are stopped. Regardless of whether the conversion data are read or not, DRDY remains low. To begin a new conversion, take the START pin low and then back high, or send the START command again. When switching from Continuous Conversion mode to Single-Shot mode, bring the START signal low and back high or send a STOP command followed by a START command.

*Figure 44. DRDY with No Data Retrieval in Single-Shot Mode — see PDF.*

This conversion mode is ideal for applications that require non-standard or non-continuous data rates. Issuing a START command or toggling the START pin high resets the digital filter, effectively dropping the data rate by a factor of four. This mode leaves the system more susceptible to aliasing effects, requiring more complex analog or digital filtering. Loading on the host processor increases because the processor must toggle the START pin or send a START command to initiate a new conversion cycle.

## 9.5 Programming

### 9.5.1 Data Format

The device provides 24 bits of data in binary twos complement format. The size of one code (LSB) is calculated using:

```
1 LSB = (2 × VREF / Gain) / 2^24 = +FS / 2^23                                          (8)
```

A positive full-scale input produces an output code of 7FFFFFh and the negative full-scale input produces an output code of 800000h. The output clips at these codes for signals exceeding full-scale. Table 9 summarizes the ideal output codes for different input signals. All 24 bits toggle when the analog input is at positive or negative full-scale.

#### Table 9. Ideal Output Code versus Input Signal

*Excludes effects of noise, linearity, offset, and gain error.*

| Input Signal, VIN (INxP - INxN) | Ideal Output Code |
|---------------------------------|-------------------|
| ≥ FS                            | 7FFFFFh |
| +FS / (2^23 – 1)                | 000001h |
| 0                               | 000000h |
| –FS / (2^23 – 1)                | FFFFFFh |
| ≤ –FS (2^23 / 2^23 – 1)         | 800000h |

### 9.5.2 SPI Interface

The SPI-compatible serial interface consists of four signals: CS, SCLK, DIN, and DOUT. The interface reads conversion data, reads and writes registers, and controls ADS1299-x operation. The data-ready output, DRDY, is used as a status signal to indicate when data are ready. DRDY goes low when new data are available.

#### 9.5.2.1 Chip Select (CS)

The CS pin activates SPI communication. CS must be low before data transactions and must stay low for the entire SPI communication period. When CS is high, the DOUT pin enters a high-impedance state. Therefore, reading and writing to the serial interface are ignored and the serial interface is reset. DRDY pin operation is independent of CS. DRDY still indicates that a new conversion has completed and is forced high as a response to SCLK, even if CS is high.

Taking CS high deactivates only the SPI communication with the device and the serial interface is reset. Data conversion continues and the DRDY signal can be monitored to check if a new conversion result is ready. A master device monitoring the DRDY signal can select the appropriate slave device by pulling the CS pin low. After the serial communication is finished, always wait four or more tCLK cycles before taking CS high.

#### 9.5.2.2 Serial Clock (SCLK)

SCLK provides the clock for serial communication. SCLK is a Schmitt-trigger input, but TI recommends keeping SCLK as free from noise as possible to prevent glitches from inadvertently shifting the data. Data are shifted into DIN on the falling edge of SCLK and shifted out of DOUT on the rising edge of SCLK.

The absolute maximum SCLK limit is specified in Figure 1. When shifting in commands with SCLK, make sure that the entire set of SCLKs is issued to the device. Failure to do so can result in the device serial interface being placed into an unknown state requiring CS to be taken high to recover.

For a single device, the minimum speed required for SCLK depends on the number of channels, number of bits of resolution, and output data rate.

For example, if the ADS1299 is used in a 500-SPS mode (8 channels, 24-bit resolution), the minimum SCLK speed is 110 kHz.

Data retrieval can be accomplished either by placing the device in RDATAC mode or by issuing an RDATA command for data on demand. The SCLK rate limitation applies to RDATAC. For the RDATA command, the limitation applies if data must be read in between two consecutive DRDY signals.

```
tSCLK < (tDR − 4 × tCLK) / (NBITS × NCHANNELS + 24)                                    (9)
```

#### 9.5.2.3 Data Input (DIN)

DIN is used along with SCLK to send data to the device. Data on DIN are shifted into the device on the falling edge of SCLK.

The communication of this device is full-duplex in nature. The device monitors commands shifted in even when data are being shifted out. Data that are present in the output shift register are shifted out when sending in a command. Therefore, make sure that whatever is being sent on the DIN pin is valid when shifting out data. When no command is to be sent to the device when reading out data, send the NOP command on DIN. Make sure that the tSDECODE timing is met when sending multiple byte commands on DIN.

#### 9.5.2.4 Data Output (DOUT)

DOUT is used with SCLK to read conversion and register data from the device. Data are clocked out on the rising edge of SCLK, MSB first. DOUT goes to a high-impedance state when CS is high.

*Figure 45. SPI Bus Data Output — see PDF (216 SCLKs for an ADS1299: 24-bit STAT + 8 × 24-bit channels).*

### 9.5.3 SPI Command Definitions

The ADS1299-x provides flexible configuration control. The commands, summarized in Table 10, control and configure device operation. The commands are stand-alone, except for the register read and write operations that require a second command byte plus data. CS can be taken high or held low between commands but must stay low for the entire command operation (especially for multi-byte commands). System commands and the RDATA command are decoded by the device on the seventh SCLK falling edge. The register read and write commands are decoded on the eighth SCLK falling edge. Be sure to follow SPI timing requirements when pulling CS high after issuing a command.

#### Table 10. Command Definitions

*Notes:*
1. *When in RDATAC mode, the RREG command is ignored.*
2. *n nnnn = number of registers to be read or written – 1. r rrrr = starting register address.*

| Command | Description | First Byte | Second Byte |
|---------|-------------|------------|-------------|
| **System Commands** | | | |
| WAKEUP   | Wake-up from standby mode | 0000 0010 (02h) | |
| STANDBY  | Enter standby mode | 0000 0100 (04h) | |
| RESET    | Reset the device | 0000 0110 (06h) | |
| START    | Start and restart (synchronize) conversions | 0000 1000 (08h) | |
| STOP     | Stop conversion | 0000 1010 (0Ah) | |
| **Data Read Commands** | | | |
| RDATAC   | Enable Read Data Continuous mode (default at power-up) | 0001 0000 (10h) | |
| SDATAC   | Stop Read Data Continuously mode | 0001 0001 (11h) | |
| RDATA    | Read data by command; supports multiple read back | 0001 0010 (12h) | |
| **Register Read Commands** | | | |
| RREG     | Read n nnnn registers starting at address r rrrr | 001r rrrr (2xh) | 000n nnnn |
| WREG     | Write n nnnn registers starting at address r rrrr | 010r rrrr (4xh) | 000n nnnn |

#### 9.5.3.1 Sending Multi-Byte Commands

The ADS1299-x serial interface decodes commands in bytes and requires 4 tCLK cycles to decode and execute. Therefore, when sending multi-byte commands (such as RREG or WREG), a 4 tCLK period must separate the end of one byte (or command) and the next.

Assuming CLK is 2.048 MHz, then tSDECODE (4 tCLK) is 1.96 µs. When SCLK is 16 MHz, one byte can be transferred in 500 ns. This byte transfer time does not meet the tSDECODE specification; therefore, a delay must be inserted so the end of the second byte arrives 1.46 µs later. If SCLK is 4 MHz, one byte is transferred in 2 µs. Because this transfer time exceeds the tSDECODE specification, the processor can send subsequent bytes without delay. In this later scenario, the serial port can be programmed to move from single-byte transfers per cycle to multiple bytes.

#### 9.5.3.2 WAKEUP: Exit STANDBY Mode

The WAKEUP command exits low-power standby mode. Time is required when exiting standby mode (see *Electrical Characteristics*). There are no SCLK rate restrictions for this command and can be issued at any time. Any following commands must be sent after a delay of 4 tCLK cycles.

#### 9.5.3.3 STANDBY: Enter STANDBY Mode

The STANDBY command enters low-power standby mode. All parts of the circuit are shut down except for the reference section. The standby mode power consumption is specified in the *Electrical Characteristics*. There are no SCLK rate restrictions for this command and can be issued at any time. Do not send any other commands other than the wakeup command after the device enters standby mode.

#### 9.5.3.4 RESET: Reset Registers to Default Values

The RESET command resets the digital filter cycle and returns all register settings to default values. There are no SCLK rate restrictions for this command and can be issued at any time. 18 tCLK cycles are required to execute the RESET command. Avoid sending any commands during this time.

#### 9.5.3.5 START: Start Conversions

The START command starts data conversions. Tie the START pin low to control conversions by command. If conversions are in progress, this command has no effect. The STOP command stops conversions. If the START command is immediately followed by a STOP command, then there must be a 4-tCLK cycle delay between them. When the START command is sent to the device, keep the START pin low until the STOP command is issued. There are no SCLK rate restrictions for this command and can be issued at any time.

#### 9.5.3.6 STOP: Stop Conversions

The STOP command stops conversions. Tie the START pin low to control conversions by command. When the STOP command is sent, the conversion in progress completes and further conversions are stopped. If conversions are already stopped, this command has no effect. There are no SCLK rate restrictions for this command and can be issued at any time.

#### 9.5.3.7 RDATAC: Read Data Continuous

The RDATAC command enables conversion data output on each DRDY without the need to issue subsequent read data commands. This mode places the conversion data in the output register and may be shifted out directly. The read data continuous mode is the device default mode; the device defaults to this mode on power-up.

RDATAC mode is cancelled by the Stop Read Data Continuous command. If the device is in RDATAC mode, a SDATAC command must be issued before any other commands can be sent to the device. There are no SCLK rate restrictions for this command. However, subsequent data retrieval SCLKs or the SDATAC command should wait at least 4 tCLK cycles before completion. RDATAC timing is illustrated in Figure 46. There is a *keep out* zone of 4 tCLK cycles around the DRDY pulse where this command cannot be issued. If no data are retrieved from the device, DOUT and DRDY behave similarly in this mode. To retrieve data from the device after the RDATAC command is issued, make sure either the START pin is high or the START command is issued. RDATAC is ideally-suited for applications such as data loggers or recorders, where registers are set one time and do not need to be reconfigured.

*Figure 46. RDATAC Usage — see PDF. tUPDATE = 4 / fCLK.*

#### 9.5.3.8 SDATAC: Stop Read Data Continuous

The SDATAC command cancels the Read Data Continuous mode. There are no SCLK rate restrictions for this command, but the next command must wait for 4 tCLK cycles before completion.

#### 9.5.3.9 RDATA: Read Data

The RDATA command loads the output shift register with the latest data when not in Read Data Continuous mode. Issue this command after DRDY goes low to read the conversion result. There are no SCLK rate restrictions for this command, and there is no wait time needed for the subsequent commands or data retrieval SCLKs. To retrieve data from the device after the RDATA command is issued, make sure either the START pin is high or the START command is issued. When reading data with the RDATA command, the read operation can overlap the next DRDY occurrence without data corruption. RDATA is best suited for ECG- and EEG-type systems, where register settings must be read or changed often between conversion cycles.

*Figure 47. RDATA Usage — see PDF.*

#### 9.5.3.10 RREG: Read From Register

This command reads register data. The Register Read command is a two-byte command followed by the register data output. The first byte contains the command and register address. The second command byte specifies the number of registers to read – 1.

- First command byte: `001r rrrr`, where `r rrrr` is the starting register address.
- Second command byte: `000n nnnn`, where `n nnnn` is the number of registers to read – 1.

The 17th SCLK rising edge of the operation clocks out the MSB of the first register. When the device is in read data continuous mode, an SDATAC command must be issued before the RREG command can be issued. The RREG command can be issued any time. However, because this command is a multi-byte command, there are SCLK rate restrictions depending on how the SCLKs are issued to meet the tSDECODE timing. Note that CS must be low for the entire command.

*Figure 48. RREG Command Example: Read Two Registers Starting from Register 00h (BYTE 1 = 0010 0000, BYTE 2 = 0000 0001) — see PDF.*

#### 9.5.3.11 WREG: Write to Register

This command writes register data. The Register Write command is a two-byte command followed by the register data input. The first byte contains the command and register address. The second command byte specifies the number of registers to write – 1.

- First command byte: `010r rrrr`, where `r rrrr` is the starting register address.
- Second command byte: `000n nnnn`, where `n nnnn` is the number of registers to write – 1.

After the command bytes, the register data follows (in MSB-first format). The WREG command can be issued any time. However, because this command is a multi-byte command, there are SCLK rate restrictions depending on how the SCLKs are issued to meet the tSDECODE timing. Note that CS must be low for the entire command.

*Figure 49. WREG Command Example: Write Two Registers Starting from 00h (BYTE 1 = 0100 0000, BYTE 2 = 0000 0001) — see PDF.*

## 9.6 Register Maps

### Table 11. Register Assignments

*Notes:*
1. *Register or bit only available in the ADS1299-6 and ADS1299. Register bits set to 0h or 00h in the ADS1299-4.*
2. *Register or bit only available in the ADS1299. Register bits set to 0h or 00h in the ADS1299-4 and ADS1299-6.*

| Address | Register | Default | Bit 7 | Bit 6 | Bit 5 | Bit 4 | Bit 3 | Bit 2 | Bit 1 | Bit 0 |
|---|---|---|---|---|---|---|---|---|---|---|
| **Read Only ID Registers** | | | | | | | | | | |
| 00h | ID | xxh | REV_ID[2:0] | | | 1 | DEV_ID[1:0] | | NU_CH[1:0] | |
| **Global Settings Across Channels** | | | | | | | | | | |
| 01h | CONFIG1 | 96h | 1 | DAISY_EN | CLK_EN | 1 | 0 | DR[2:0] | | |
| 02h | CONFIG2 | C0h | 1 | 1 | 0 | INT_CAL | 0 | CAL_AMP0 | CAL_FREQ[1:0] | |
| 03h | CONFIG3 | 60h | PD_REFBUF | 1 | 1 | BIAS_MEAS | BIASREF_INT | PD_BIAS | BIAS_LOFF_SENS | BIAS_STAT |
| 04h | LOFF | 00h | COMP_TH[2:0] | | | 0 | ILEAD_OFF[1:0] | | FLEAD_OFF[1:0] | |
| **Channel-Specific Settings** | | | | | | | | | | |
| 05h | CH1SET | 61h | PD1 | GAIN1[2:0] | | | SRB2 | MUX1[2:0] | | |
| 06h | CH2SET | 61h | PD2 | GAIN2[2:0] | | | SRB2 | MUX2[2:0] | | |
| 07h | CH3SET | 61h | PD3 | GAIN3[2:0] | | | SRB2 | MUX3[2:0] | | |
| 08h | CH4SET | 61h | PD4 | GAIN4[2:0] | | | SRB2 | MUX4[2:0] | | |
| 09h | CH5SET¹ | 61h | PD5 | GAIN5[2:0] | | | SRB2 | MUX5[2:0] | | |
| 0Ah | CH6SET¹ | 61h | PD6 | GAIN6[2:0] | | | SRB2 | MUX6[2:0] | | |
| 0Bh | CH7SET² | 61h | PD7 | GAIN7[2:0] | | | SRB2 | MUX7[2:0] | | |
| 0Ch | CH8SET² | 61h | PD8 | GAIN8[2:0] | | | SRB2 | MUX8[2:0] | | |
| 0Dh | BIAS_SENSP | 00h | BIASP8² | BIASP7² | BIASP6¹ | BIASP5¹ | BIASP4 | BIASP3 | BIASP2 | BIASP1 |
| 0Eh | BIAS_SENSN | 00h | BIASN8² | BIASN7² | BIASN6¹ | BIASN5¹ | BIASN4 | BIASN3 | BIASN2 | BIASN1 |
| 0Fh | LOFF_SENSP | 00h | LOFFP8² | LOFFP7² | LOFFP6¹ | LOFFP5¹ | LOFFP4 | LOFFP3 | LOFFP2 | LOFFP1 |
| 10h | LOFF_SENSN | 00h | LOFFM8² | LOFFM7² | LOFFM6¹ | LOFFM5¹ | LOFFM4 | LOFFM3 | LOFFM2 | LOFFM1 |
| 11h | LOFF_FLIP | 00h | LOFF_FLIP8² | LOFF_FLIP7² | LOFF_FLIP6¹ | LOFF_FLIP5¹ | LOFF_FLIP4 | LOFF_FLIP3 | LOFF_FLIP2 | LOFF_FLIP1 |
| **Lead-Off Status Registers (Read-Only)** | | | | | | | | | | |
| 12h | LOFF_STATP | 00h | IN8P_OFF | IN7P_OFF | IN6P_OFF | IN5P_OFF | IN4P_OFF | IN3P_OFF | IN2P_OFF | IN1P_OFF |
| 13h | LOFF_STATN | 00h | IN8M_OFF | IN7M_OFF | IN6M_OFF | IN5M_OFF | IN4M_OFF | IN3M_OFF | IN2M_OFF | IN1M_OFF |
| **GPIO and OTHER Registers** | | | | | | | | | | |
| 14h | GPIO    | 0Fh | GPIOD[4:1] | | | | GPIOC[4:1] | | | |
| 15h | MISC1   | 00h | 0 | 0 | SRB1 | 0 | 0 | 0 | 0 | 0 |
| 16h | MISC2   | 00h | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 17h | CONFIG4 | 00h | 0 | 0 | 0 | 0 | SINGLE_SHOT | 0 | PD_LOFF_COMP | 0 |

### 9.6.1 User Register Description

The read-only ID control register is programmed during device manufacture to indicate device characteristics.

#### 9.6.1.1 ID: ID Control Register (address = 00h, reset = xxh)

| Bit | Field | Type | Reset | Description |
|---|---|---|---|---|
| 7:5 | REV_ID[2:0] | R | xh | Reserved. Indicates the revision of the device, subject to change without notice. |
| 4   | Reserved | R | 1h | Always read 1. |
| 3:2 | DEV_ID[1:0] | R | 3h | Device identification. `11` = ADS1299-x. |
| 1:0 | NU_CH[1:0] | R | xh | Number of channels. `00` = 4-channel ADS1299-4; `01` = 6-channel ADS1299-6; `10` = 8-channel ADS1299. |

#### 9.6.1.2 CONFIG1: Configuration Register 1 (address = 01h, reset = 96h)

This register configures the DAISY_EN bit, clock, and data rate.

| Bit | Field | Type | Reset | Description |
|---|---|---|---|---|
| 7   | Reserved   | R/W | 1h | Always write 1h. |
| 6   | DAISY_EN   | R/W | 0h | Daisy-chain or multiple readback mode. `0` = Daisy-chain mode; `1` = Multiple readback mode. |
| 5   | CLK_EN     | R/W | 0h | CLK connection. `0` = Oscillator clock output disabled; `1` = Oscillator clock output enabled. (Drives the CLK pin when CLKSEL = 1.) |
| 4:3 | Reserved   | R/W | 2h | Always write 2h. |
| 2:0 | DR[2:0]    | R/W | 6h | Output data rate. fMOD = fCLK / 2. `000`=fMOD/64 (16 kSPS), `001`=fMOD/128 (8 kSPS), `010`=fMOD/256 (4 kSPS), `011`=fMOD/512 (2 kSPS), `100`=fMOD/1024 (1 kSPS), `101`=fMOD/2048 (500 SPS), `110`=fMOD/4096 (250 SPS), `111`=Reserved. |

#### 9.6.1.3 CONFIG2: Configuration Register 2 (address = 02h, reset = C0h)

This register configures the test signal generation.

| Bit | Field | Type | Reset | Description |
|---|---|---|---|---|
| 7:5 | Reserved | R/W | 6h | Always write 6h. |
| 4   | INT_CAL  | R/W | 0h | TEST source. `0` = Test signals driven externally; `1` = Test signals generated internally. |
| 3   | Reserved | R/W | 0h | Always write 0h. |
| 2   | CAL_AMP  | R/W | 0h | Test signal amplitude. `0` = 1 × –(VREFP – VREFN) / 2400; `1` = 2 × –(VREFP – VREFN) / 2400. |
| 1:0 | CAL_FREQ[1:0] | R/W | 0h | Test signal frequency. `00` = Pulsed at fCLK/2²¹; `01` = Pulsed at fCLK/2²⁰; `10` = Do not use; `11` = At dc. |

#### 9.6.1.4 CONFIG3: Configuration Register 3 (address = 03h, reset = 60h)

Configures either an internal or external reference and BIAS operation.

| Bit | Field | Type | Reset | Description |
|---|---|---|---|---|
| 7 | PD_REFBUF | R/W | 0h | Power-down reference buffer. `0` = Power-down internal reference buffer; `1` = Enable internal reference buffer. |
| 6:5 | Reserved | R/W | 3h | Always write 3h. |
| 4 | BIAS_MEAS | R/W | 0h | BIAS measurement. `0` = Open; `1` = BIAS_IN signal routed to the channel set with MUX = `010` (VREF). |
| 3 | BIASREF_INT | R/W | 0h | BIASREF signal source. `0` = External; `1` = Internally generated (AVDD + AVSS) / 2. |
| 2 | PD_BIAS | R/W | 0h | BIAS buffer power. `0` = Powered down; `1` = Enabled. |
| 1 | BIAS_LOFF_SENS | R/W | 0h | BIAS sense function. `0` = Disabled; `1` = Enabled. |
| 0 | BIAS_STAT | R | 0h | BIAS lead-off status. `0` = Connected; `1` = Not connected. |

#### 9.6.1.5 LOFF: Lead-Off Control Register (address = 04h, reset = 00h)

Configures the lead-off detection operation.

| Bit | Field | Type | Reset | Description |
|---|---|---|---|---|
| 7:5 | COMP_TH[2:0] | R/W | 0h | Lead-off comparator threshold. Positive side: `000`=95%, `001`=92.5%, `010`=90%, `011`=87.5%, `100`=85%, `101`=80%, `110`=75%, `111`=70%. Negative side (complementary): 5%, 7.5%, 10%, 12.5%, 15%, 20%, 25%, 30%. |
| 4   | Reserved      | R/W | 0h | Always write 0h. |
| 3:2 | ILEAD_OFF[1:0] | R/W | 0h | Lead-off current magnitude. `00` = 6 nA; `01` = 24 nA; `10` = 6 µA; `11` = 24 µA. |
| 1:0 | FLEAD_OFF[1:0] | R/W | 0h | Lead-off frequency. `00` = DC lead-off; `01` = AC lead-off at 7.8 Hz (fCLK/2¹⁸); `10` = AC lead-off at 31.2 Hz (fCLK/2¹⁶); `11` = AC lead-off at fDR/4. |

#### 9.6.1.6 CHnSET: Individual Channel Settings (n = 1 to 8) (addresses = 05h to 0Ch, reset = 61h)

Configures the power mode, PGA gain, and multiplexer settings for each channel.

| Bit | Field | Type | Reset | Description |
|---|---|---|---|---|
| 7   | PDn       | R/W | 0h | Power-down. `0` = Normal operation; `1` = Channel power-down. (When powering down a channel, set MUXn[2:0] = `001` to short the input.) |
| 6:4 | GAINn[2:0]| R/W | 6h | PGA gain. `000` = 1, `001` = 2, `010` = 4, `011` = 6, `100` = 8, `101` = 12, `110` = 24, `111` = Do not use. |
| 3   | SRB2      | R/W | 0h | SRB2 connection. `0` = Open; `1` = Closed. |
| 2:0 | MUXn[2:0] | R/W | 1h | Channel input. `000` = Normal electrode; `001` = Input shorted (offset/noise); `010` = Used with BIAS_MEAS for BIAS measurement; `011` = MVDD for supply measurement; `100` = Temperature sensor; `101` = Test signal; `110` = BIAS_DRP (positive electrode is the driver); `111` = BIAS_DRN (negative electrode is the driver). |

#### 9.6.1.7 BIAS_SENSP: Bias Drive Positive Derivation Register (address = 0Dh, reset = 00h)

Selects positive signals from each channel for BIAS derivation. Bits[5:4] are not available on the ADS1299-4. Bits[7:6] are not available on the ADS1299-4 or ADS1299-6.

| Bit | Field | Description |
|---|---|---|
| 7 | BIASP8 | IN8P → BIAS. `0` = Disabled, `1` = Enabled. |
| 6 | BIASP7 | IN7P → BIAS. |
| 5 | BIASP6 | IN6P → BIAS. |
| 4 | BIASP5 | IN5P → BIAS. |
| 3 | BIASP4 | IN4P → BIAS. |
| 2 | BIASP3 | IN3P → BIAS. |
| 1 | BIASP2 | IN2P → BIAS. |
| 0 | BIASP1 | IN1P → BIAS. |

#### 9.6.1.8 BIAS_SENSN: Bias Drive Negative Derivation Register (address = 0Eh, reset = 00h)

Selects negative signals from each channel for BIAS derivation. Same chip-availability notes as BIAS_SENSP.

| Bit | Field | Description |
|---|---|---|
| 7 | BIASN8 | IN8N → BIAS. `0` = Disabled, `1` = Enabled. |
| 6 | BIASN7 | IN7N → BIAS. |
| 5 | BIASN6 | IN6N → BIAS. |
| 4 | BIASN5 | IN5N → BIAS. |
| 3 | BIASN4 | IN4N → BIAS. |
| 2 | BIASN3 | IN3N → BIAS. |
| 1 | BIASN2 | IN2N → BIAS. |
| 0 | BIASN1 | IN1N → BIAS. |

#### 9.6.1.9 LOFF_SENSP: Positive Signal Lead-Off Detection Register (address = 0Fh, reset = 00h)

Selects positive side per channel for lead-off detection. LOFF_STATP bits are only valid when the corresponding LOFF_SENSP bit is set. Same chip-availability notes as BIAS_SENSP.

| Bit | Field | Description |
|---|---|---|
| 7 | LOFFP8 | Enable lead-off detection on IN8P. |
| 6 | LOFFP7 | Enable lead-off detection on IN7P. |
| 5 | LOFFP6 | Enable lead-off detection on IN6P. |
| 4 | LOFFP5 | Enable lead-off detection on IN5P. |
| 3 | LOFFP4 | Enable lead-off detection on IN4P. |
| 2 | LOFFP3 | Enable lead-off detection on IN3P. |
| 1 | LOFFP2 | Enable lead-off detection on IN2P. |
| 0 | LOFFP1 | Enable lead-off detection on IN1P. |

#### 9.6.1.10 LOFF_SENSN: Negative Signal Lead-Off Detection Register (address = 10h, reset = 00h)

Selects negative side per channel for lead-off detection. Same notes as LOFF_SENSP.

| Bit | Field | Description |
|---|---|---|
| 7 | LOFFM8 | Enable lead-off detection on IN8N. |
| 6 | LOFFM7 | Enable lead-off detection on IN7N. |
| 5 | LOFFM6 | Enable lead-off detection on IN6N. |
| 4 | LOFFM5 | Enable lead-off detection on IN5N. |
| 3 | LOFFM4 | Enable lead-off detection on IN4N. |
| 2 | LOFFM3 | Enable lead-off detection on IN3N. |
| 1 | LOFFM2 | Enable lead-off detection on IN2N. |
| 0 | LOFFM1 | Enable lead-off detection on IN1N. |

#### 9.6.1.11 LOFF_FLIP: Lead-Off Flip Register (address = 11h, reset = 00h)

Controls the direction of the current used for lead-off derivation. For each channel n, `0` = no flip (INnP pulled to AVDD, INnN pulled to AVSS); `1` = flipped (INnP pulled to AVSS, INnN pulled to AVDD).

| Bit | Field | Channel |
|---|---|---|
| 7 | LOFF_FLIP8 | Channel 8 |
| 6 | LOFF_FLIP7 | Channel 7 |
| 5 | LOFF_FLIP6 | Channel 6 |
| 4 | LOFF_FLIP5 | Channel 5 |
| 3 | LOFF_FLIP4 | Channel 4 |
| 2 | LOFF_FLIP3 | Channel 3 |
| 1 | LOFF_FLIP2 | Channel 2 |
| 0 | LOFF_FLIP1 | Channel 1 |

#### 9.6.1.12 LOFF_STATP: Lead-Off Positive Signal Status Register (address = 12h, reset = 00h, read-only)

Stores whether the positive electrode on each channel is on or off. Ignore values when the corresponding LOFF_SENSP bit is 0. `0` = Electrode on; `1` = Electrode off.

| Bit | Field | Channel |
|---|---|---|
| 7 | IN8P_OFF | Channel 8 |
| 6 | IN7P_OFF | Channel 7 |
| 5 | IN6P_OFF | Channel 6 |
| 4 | IN5P_OFF | Channel 5 |
| 3 | IN4P_OFF | Channel 4 |
| 2 | IN3P_OFF | Channel 3 |
| 1 | IN2P_OFF | Channel 2 |
| 0 | IN1P_OFF | Channel 1 |

#### 9.6.1.13 LOFF_STATN: Lead-Off Negative Signal Status Register (address = 13h, reset = 00h, read-only)

Stores whether the negative electrode on each channel is on or off. Ignore values when the corresponding LOFF_SENSN bit is 0. `0` = Electrode on; `1` = Electrode off.

| Bit | Field | Channel |
|---|---|---|
| 7 | IN8N_OFF | Channel 8 |
| 6 | IN7N_OFF | Channel 7 |
| 5 | IN6N_OFF | Channel 6 |
| 4 | IN5N_OFF | Channel 5 |
| 3 | IN4N_OFF | Channel 4 |
| 2 | IN3N_OFF | Channel 3 |
| 1 | IN2N_OFF | Channel 2 |
| 0 | IN1N_OFF | Channel 1 |

#### 9.6.1.14 GPIO: General-Purpose I/O Register (address = 14h, reset = 0Fh)

Controls the action of the GPIO pins. When RESP_CTRL[1:0] is in mode `01` or `11`, GPIO2/3/4 are not available.

| Bit | Field | Type | Reset | Description |
|---|---|---|---|---|
| 7:4 | GPIOD[4:1] | R/W | 0h | GPIO data. Read returns the pin state regardless of direction. Write sets the output level when the pin is configured as an output. |
| 3:0 | GPIOC[4:1] | R/W | Fh | GPIO direction (per pin). `0` = Output; `1` = Input. |

#### 9.6.1.15 MISC1: Miscellaneous 1 Register (address = 15h, reset = 00h)

Controls routing the SRB1 pin to all inverting channel inputs.

| Bit | Field | Type | Reset | Description |
|---|---|---|---|---|
| 7:6 | Reserved | R/W | 0h | Always write 0h. |
| 5   | SRB1     | R/W | 0h | `0` = Switches open; `1` = Switches closed (SRB1 connected to all inverting inputs). |
| 4:0 | Reserved | R/W | 0h | Always write 0h. |

#### 9.6.1.16 MISC2: Miscellaneous 2 (address = 16h, reset = 00h)

Reserved for future use. All bits always write 0h.

#### 9.6.1.17 CONFIG4: Configuration Register 4 (address = 17h, reset = 00h)

Configures the conversion mode and enables the lead-off comparators.

| Bit | Field | Type | Reset | Description |
|---|---|---|---|---|
| 7:4 | Reserved      | R/W | 0h | Always write 0h. |
| 3   | SINGLE_SHOT   | R/W | 0h | `0` = Continuous conversion mode; `1` = Single-shot mode. |
| 2   | Reserved      | R/W | 0h | Always write 0h. |
| 1   | PD_LOFF_COMP  | R/W | 0h | `0` = Lead-off comparators disabled; `1` = Lead-off comparators enabled. |
| 0   | Reserved      | R/W | 0h | Always write 0h. |

## 10 Applications and Implementation

> *Information in the following applications sections is not part of the TI component specification, and TI does not warrant its accuracy or completeness. TI's customers are responsible for determining suitability of components for their purposes. Customers should validate and test their design implementation to confirm system functionality.*

### 10.1 Application Information

#### 10.1.1 Unused Inputs and Outputs

- Power down unused analog inputs and connect them directly to AVDD.
- Power down the Bias amplifier if unused and float BIASOUT and BIASINV. BIASIN can also float or can be tied directly to AVSS if unused.
- Tie BIASREF directly to AVSS or leave floating if unused.
- Tie SRB1 and SRB2 directly to AVSS or leave them floating if unused.
- Do not float unused digital inputs because excessive power-supply leakage current might result. Set the two-state mode setting pins high to DVDD or low to DGND through ≥10-kΩ resistors.
- Pull DRDY to supply using weak pullup resistor if unused.
- If not daisy-chaining devices, tie DAISYIN directly to DGND.

#### 10.1.2 Setting the Device for Basic Data Capture

Figure 67 outlines the procedure to configure the device in a basic state and capture data. This procedure puts the device into a configuration that matches the parameters listed in the specifications section, in order to check if the device is working properly in the user system. Follow this procedure initially until familiar with the device settings. After this procedure has been verified, the device can be configured as needed.

**Power-up flow (summary of Figure 67):**

```
Analog and Digital Power-Up
    |
    +-- External clock?
    |      Yes -> Set CLKSEL = 0; provide external clock fCLK = 2.048 MHz
    |      No  -> Set CLKSEL = 1; wait for oscillator to wake up
    |
    +-- Set PDWN = 1, RESET = 1, wait > tPOR for power-on reset
    |
    +-- Wait until VCAP1 ≥ 1.1 V
    |
    +-- Issue reset pulse, wait 18 tCLK
    |
    +-- Send SDATAC command (device wakes in RDATAC mode)
    |
    +-- External reference?
    |      No  -> Set PD_REFBUF = 1, wait for internal reference to settle
    |             (WREG CONFIG3 0xE0)
    |      Yes -> proceed
    |
    +-- Write CONFIG1 = 0x96, CONFIG2 = 0xC0, all CHnSET = 0x01 (input short)
    |
    +-- Set START = 1 (DRDY toggles at fCLK / 8192 thereafter)
    |
    +-- RDATAC, capture data, check noise
    |
    +-- Activate test signals: SDATAC, WREG CONFIG2 0xD0, WREG CHnSET 0x05, RDATAC
    |
    +-- Capture and verify test signal
```

##### 10.1.2.1 Lead-Off

Sample code to set DC lead-off with pull-up and pull-down resistors on all channels:

```
WREG LOFF        0x13   // Comparator threshold at 95% and 5%, pullup or pulldown resistor
                        // dc lead-off
WREG CONFIG4     0x02   // Turn on dc lead-off comparators
WREG LOFF_SENSP  0xFF   // Turn on the P-side of all channels for lead-off sensing
WREG LOFF_SENSN  0xFF   // Turn on the N-side of all channels for lead-off sensing
```

Observe the status bits of the output data stream to monitor lead-off status.

##### 10.1.2.2 Bias Drive

Sample code to choose bias as an average of the first three channels:

```
WREG RLD_SENSP   0x07           // Select channel 1-3 P-side for RLD sensing
WREG RLD_SENSN   0x07           // Select channel 1-3 N-side for RLD sensing
WREG CONFIG3     0bx1xx 1100    // Turn on BIAS amplifier, set internal BIASREF voltage
```

Sample code to route the BIASOUT signal through channel 4 N-side and measure bias with channel 5 (BIASOUT must be connected externally to BIASIN):

```
WREG CONFIG3   0bxxx1 1100  // Turn on BIAS amp, internal BIASREF, set BIAS measurement bit
WREG CH4SET    0bxxxx 0111  // Route BIASIN to channel 4 N-side
WREG CH5SET    0bxxxx 0010  // Route BIASIN to be measured at channel 5 w.r.t. BIASREF
```

#### 10.1.3 Establishing the Input Common-Mode

The ADS1299-x measures fully-differential signals where the common-mode voltage point is the midpoint of the positive and negative analog input. The internal PGA restricts the common-mode input range because of the headroom required for operation. The human body is prone to common-mode drifts because noise easily couples onto the human body, similar to an antenna. These common-mode drifts may push the ADS1299-x input common-mode voltage out of the measurable range of the ADC.

If a patient-drive electrode is used by the system, the ADS1299-x includes an on-chip bias drive (BIAS) amplifier that connects to the patient drive electrode. The BIAS amplifier function is to bias the patient to maintain the other electrode common-mode voltages within the valid range. When powered on, the amplifier uses either the analog midsupply voltage, or the voltage present at the BIASREF pin, as a reference input to drive the patient to that voltage.

The ADS1299-x provides the option to use input electrode voltages as feedback to the amplifier to more effectively stabilize the output to the amplifier reference voltage by setting corresponding bits in the BIAS_SENSP and BIAS_SENSN registers. Figure 68 shows an example of a three-electrode system that leverages this technique.

*Figure 68. Setting Common-Mode Using BIAS Electrode — see PDF.*

#### 10.1.4 Multiple Device Configuration

The ADS1299-x is designed to provide configuration flexibility when multiple devices are used in a system. The serial interface typically needs four signals: DIN, DOUT, SCLK, and CS. With one additional chip select signal per device, multiple devices can be connected together. The number of signals needed to interface n devices is `3 + n`.

The BIAS drive amplifiers can be daisy-chained. To use the internal oscillator in a daisy-chain configuration, one device must be set as the master for the clock source with the internal oscillator enabled (CLKSEL pin = 1) and the internal oscillator clock brought out of the device by setting the CLK_EN register bit to '1'. This master device clock is used as the external clock source for other devices.

When using multiple devices, the devices can be synchronized with the START signal. The delay from START to the DRDY signal is fixed for a given data rate. Figure 69 shows the behavior of two devices when synchronized with the START signal.

*Figure 69. Synchronizing Multiple Converters — see PDF.*

There are two ways to connect multiple devices with an optimal number of interface pins: cascade mode and daisy-chain mode.

##### 10.1.4.1 Cascaded Mode

Figure 70a illustrates a configuration with two devices cascaded together. Together, the devices create a system with 16 channels. DOUT, SCLK, and DIN are shared. Each device has its own chip select. When a device is not selected by the corresponding CS being driven to logic 1, the DOUT of this device is high-impedance. This structure allows the other device to take control of the DOUT bus. This configuration method is suitable for the majority of applications.

##### 10.1.4.2 Daisy-Chain Mode

Daisy-chain mode is enabled by setting the DAISY_EN bit in the CONFIG1 register. Figure 70b shows the daisy-chain configuration. In this mode SCLK, DIN, and CS are shared across multiple devices. The DOUT of the second device is connected to the DAISY_IN of the first device, thereby creating a chain. When using daisy-chain mode, the multiple readback feature is not available. Short the DAISY_IN pin to digital ground if not used. Figure 2 describes the required timing for the device shown in the configurations of Figure 70. Status and data from device 1 appear first on DOUT, followed by the status and data from device 2. The ADS1299 can be daisy-chained with a second ADS1299, an ADS1299-6, or an ADS1299-4.

*Figure 70. Multiple Device Configurations — see PDF (a: standard, b: daisy-chain).*

When all devices in the chain operate in the same register setting, DIN can be shared as well. This configuration reduces the SPI communication signals to four, regardless of the number of devices. The BIAS driver cannot be shared among the multiple devices and an external clock must be used because the individual devices cannot be programmed when sharing a common DIN.

The SCLK rising edge shifts data out of the device on DOUT. The SCLK negative edge is used to latch data into the device DAISY_IN pin down the chain. This architecture allows for a faster SCLK rate speed, but also makes the interface sensitive to board-level signal delays. The more devices in the chain, the more challenging adhering to setup and hold times becomes. A star-pattern connection of SCLK to all devices, minimizing DOUT length, and other PCB layout techniques helps. Placing delay circuits (such as buffers) between DOUT and DAISY_IN, or inserting a D flip-flop clocked on inverted SCLK, can mitigate this. Daisy-chain mode requires some software overhead to recombine data bits spread across byte boundaries.

*Figure 71. Daisy-Chain Timing — see PDF.*

The maximum number of devices that can be daisy-chained depends on the data rate at which the device is operated. The maximum number of devices can be approximately calculated with:

```
NDEVICES = fSCLK / ( fDR × (NBITS × NCHANNELS) + 24 )                                  (10)
```

Where NBITS = device resolution (depending on data rate), NCHANNELS = number of channels in the device.

For example, when the 8-channel ADS1299 is operated at a 2-kSPS data rate with a 4-MHz fSCLK, 10 devices can be daisy-chained.

### 10.2 Typical Application

The biopotential signals that are measured in electroencephalography (EEG) are small when compared to other types of biopotential signals. The ADS1299 is equipped to measure such small signals due to its extremely low input-referred noise from its high performance internal PGA. Figure 72 shows how to measure electrode potentials in a sequential montage; Figure 73 illustrates referential montage measurement connections.

*Figure 72. Sequential montage example schematic — see PDF.*
*Figure 73. Referential montage example schematic — see PDF.*

#### 10.2.1 Design Requirements

| Design Parameter        | Value      |
|-------------------------|------------|
| Bandwidth               | 1 Hz – 50 Hz |
| Minimum signal amplitude| 10 μVPk    |
| Input Impedance         | > 10 MΩ    |
| Coupling                | dc         |

#### 10.2.2 Detailed Design Procedure

Each channel on the ADS1299 is optimized to measure a separate EEG waveform. The specific connections depend on the EEG montage. The sequential montage is a configuration where each channel represents the voltage between two adjacent electrodes. For example, to measure the potential between electrode Fp1 and F7 on channel 1 of the ADS1299, route the Fp1 electrode to IN1P and the F7 electrode to IN1N. The connections for a sequential montage are illustrated in Figure 72.

Alternatively, EEG electrodes can be measured in a referential montage in which each of the electrodes is measured with respect to a single reference electrode. This montage also allows calculation of the waveforms that would have been measured in a sequential montage by finding the difference between two electrode waveforms which were measured with respect to the same electrode. The ADS1299 allows for such a configuration through the use of the SRB1 pin. The SRB1 pin on the ADS1299 may be internally routed to each channel negative input by setting the SRB1 bit in the MISC1 register. When the reference electrode is connected to the SRB1 pin and all other electrodes are connected to the respective positive channel inputs, the electrode voltages can be measured with a referential montage.

The ADS1299 is designed to be an EEG front end such that no additional amplification or buffer stage is needed between the electrodes and the ADS1299. The ADS1299 has a low-noise PGA with excellent input-referred noise performance. For certain data rate and gain settings, the ADS1299 introduces significantly less than 1 μVRMS of input-referred noise to the signal chain making the device more than capable of handling the 10-μVPk minimum signal amplitude.

Traditional EEG data acquisition systems high-pass filter the signals in the front-end to remove dc signal content. This topology allows the signal to be amplified by a large gain so the signal can be digitized by a 12- to 16-bit ADC. The ADS1299 24-bit resolution allows the signal to be dc-coupled to the ADC because small EEG signal information can be measured in addition to a significant dc offset.

The ADS1299 channel inputs have very low input bias current allowing electrodes to be connected to the inputs of the ADS1299 with very little leakage current flowing on the patient cables. The ADS1299 has a minimum dc input impedance of 1 GΩ when the lead-off current sources are disabled and 500 MΩ typically when the lead-off current sources are enabled.

The passive components RFilt and CFilt form low-pass filters. In general, the filter is advised to be formed by using a differential capacitor CFilt that shunts the inputs rather than individual RC filters whose capacitors shunt to ground. The differential capacitor configuration significantly improves common-mode rejection because this approach removes dependence on component mismatch.

The cutoff frequency for the filter can be placed well past the data rate of the ADC because of the delta-sigma ADC filter-then-decimate topology. Take care to prevent aliasing around the first repetition of the digital decimation filter response at fMOD. Assuming a 2.048-MHz fCLK, fMOD = 1.024 MHz. The value of RFilt has a minimum set by technical standards for medical electronics. The capacitor value must be set to arrange the proper cutoff frequency.

If the system is likely to be exposed to high-frequency EMI, adding very small-value, common-mode capacitors to the inputs is advisable to filter high-frequency common-mode signals. If these capacitors are added, they should be 10 or 20 times smaller than the differential capacitor to ensure their effect on CMRR is minimized.

The integrated bias amplifier serves two purposes in an EEG data acquisition system with the ADS1299. The bias amplifier provides a bias voltage that, when applied to the patient, keeps the measurement electrode common-mode voltage within the rails of the ADS1299, allowing dc coupling. In addition, the bias amplifier can be configured to provide negative common-mode feedback to the patient to cancel unwanted common-mode signals appearing on the electrodes. This feature is especially helpful because biopotential acquisition systems are notoriously prone to mains-frequency common-mode interference.

The bias amplifier is powered on by setting the PD_BIAS bit in the CONFIG3 register. Set the BIASREF_INT bit in the CONFIG3 register to input the internally generated analog mid-supply voltage to the noninverting input of the bias amplifier. To enable an electrode as an input to the bias amplifier, set the corresponding bit in the BIAS_SENSP or BIAS_SENSN register.

The dc gain of the bias amplifier is determined by Rf and the number of channel inputs enabled as inputs to the bias amplifier. The bias amplifier circuit only passes common-mode signals; therefore, the 330-kΩ resistors at each PGA output are *in parallel* for common-mode signals. The bias amplifier is configured in an inverting gain scheme. The formula for determining dc gain for common-mode signals input to the bias amplifier is:

```
Vout / Vin = -(Rf × N) / 330 kΩ                                                        (11)
```

The capacitor Cf sets the bandwidth for the bias amplifier. Ensure that the amplifier has enough bandwidth to output all the intended common-mode signals.

Another advantage to a dc-coupled EEG data acquisition system is the ability to detect when an electrode no longer makes good contact with the patient. The ADS1299 features integrated lead-off detection electronics. When configured in a referential montage, only use one lead-off current source with the reference electrode.

#### 10.2.3 Application Curves

Testing the capability of the ADS1299 to measure signals in the band and near the amplitude of typical EEG signals can be done with a precision signal generator. The ADS1299 was tested in a configuration similar to Figure 74.

*Figure 74. Test circuit for example EEG measurement: 10-Hz, 33-μVRMS source attenuated by a 952-kΩ / 10.3-kΩ divider into INxP, with 4.99-kΩ / 4.7-nF differential RC at the input. AVDD = +2.5 V, AVSS = –2.5 V.*

The 952-kΩ and 10.3-kΩ resistors were used to attenuate the voltage from the signal source because the source could not reach the desired magnitude directly. With the voltage divider, the signal appearing at the inputs was a 3.5-μVRMS, 10-Hz sine wave. Figure 75 shows the input-referred conversion results from the ADS1299 following calibration for offset. The signal that is measured is similar to some of the smallest extracranial EEG signals that can be measured with typical EEG acquisition systems. The signal can be clearly identified. Given this measurement setup was a single-ended configuration without shielding, the measurement setup was subject to significant mains interference. A digital low-pass filter was applied to remove the interference.

*Figure 75. ADS1299 10-Hz Input Signal Results — see PDF.*

## 11 Power Supply Recommendations

The ADS1299-x has three power supplies: AVDD, AVDD1, and DVDD. For best performance, both AVDD and AVDD1 must be as quiet as possible. AVDD1 provides the supply to the charge pump block and has transients at fCLK. Therefore, star connect AVDD1 to the AVDD pins and AVSS1 to the AVSS pins. AVDD and AVDD1 noise that is nonsynchronous with the ADS1299-x operation must be eliminated. Bypass each device supply with 10-μF and 0.1-μF solid ceramic capacitors. For best performance, place the digital circuits (DSP, microcontrollers, FPGAs, and so forth) in the system so that the return currents on those devices do not cross the analog return path of the device. Power the ADS1299-x from unipolar or bipolar supplies.

Use surface-mount, low-cost, low-profile, multilayer ceramic-type capacitors for decoupling. In most cases, the VCAP1 capacitor is also a multilayer ceramic; however, in systems where the board is subjected to high- or low-frequency vibration, install a nonferroelectric capacitor, such as a tantalum or class 1 capacitor (C0G or NPO). EIA class 2 and class 3 dielectrics such as (X7R, X5R, X8R, and so forth) are ferroelectric. The piezoelectric property of these capacitors can appear as electrical noise coming from the capacitor. When using internal reference, noise on the VCAP1 node results in performance degradation.

### 11.1 Power-Up Sequencing

Before device power up, all digital and analog inputs must be low. At the time of power up, keep all of these signals low until the power supplies have stabilized.

Allow time for the supply voltages to reach their final value, and then begin supplying the master clock signal to the CLK pin. Wait for time tPOR, then transmit a reset pulse using either the RESET pin or RESET command to initialize the digital portion of the chip. Issue the reset after tPOR or after the VCAP1 voltage is greater than 1.1 V, whichever time is longer.

- tPOR is described in the timing requirements (below).
- The VCAP1 pin charge time is set by the RC time constant set by the capacitor value on VCAP1.

After releasing the RESET pin, program the configuration registers.

*Figure 76. Power-Up Timing Diagram — see PDF.*
*Notes: Timing to reset pulse is tPOR or after tBG, whichever is longer. When using an external clock, tPOR timing does not start until CLK is present and valid.*

#### Table 30. Power-Up Timing Requirements

| Symbol | Description | Min | Max | Unit |
|--------|-------------|-----|-----|------|
| tPOR   | Wait after power up until reset | 2¹⁸ | | tCLK |
| tRST   | Reset low duration | 2 | | tCLK |

### 11.2 Connecting the Device to Unipolar (5 V and 3.3 V) Supplies

Figure 77 illustrates the ADS1299-x connected to a unipolar supply. In this example, the analog supply (AVDD) is referenced to analog ground (AVSS) and the digital supply (DVDD) is referenced to digital ground (DGND). Place the capacitors for supply, reference, and VCAP1 to VCAP4 as close to the package as possible.

*Figure 77. Single-Supply Operation — see PDF.*

### 11.3 Connecting the Device to Bipolar (±2.5 V and 3.3 V) Supplies

Figure 78 shows the ADS1299-x connected to a bipolar supply. In this example, the analog supplies connect to the device analog supply (AVDD). This supply is referenced to the device analog return (AVSS), and the digital supply (DVDD) is referenced to the device digital ground return (DGND). Place the capacitors for supply, reference, and VCAP1 to VCAP4 as close to the package as possible.

*Figure 78. Bipolar Supply Operation — see PDF.*

## 12 Layout

### 12.1 Layout Guidelines

TI recommends employing best design practices when laying out a printed-circuit board (PCB) for both analog and digital components. This recommendation generally means that the layout separates analog components (such as ADCs, amplifiers, references, DACs, and analog MUXs) from digital components (such as microcontrollers, CPLDs, FPGAs, RF transceivers, USB transceivers, and switching regulators). An example of good component placement is shown in Figure 79. There is no single layout that is perfect for every design and careful consideration must always be used when designing with any analog component.

*Figure 79. System Component Placement — see PDF.*

The following outlines some basic recommendations for the layout of the ADS1299-x:

- Separate analog and digital signals. Partition the board into analog and digital sections where the layout permits. Route digital lines away from analog lines. This configuration prevents digital noise from coupling back into analog signals.
- The ground plane can be split into an analog plane (AGND) and digital plane (DGND), but is not necessary. Place digital signals over the digital plane, and analog signals over the analog plane. As a final step in the layout, the split between the analog and digital grounds must be connected together at the ADC.
- Fill void areas on signal layers with ground fill.
- Provide good ground return paths. Signal return currents flow on the path of least impedance. If the ground plane is cut or has other traces that block the current from flowing right next to the signal trace, then the current must find another path to return to the source and complete the circuit. Sensitive signals are more susceptible to EMI interference.
- Use bypass capacitors on supplies to reduce high-frequency noise. Do not place vias between bypass capacitors and the active device. Placing the bypass capacitors on the same layer as close to the active device yields the best results.
- Analog inputs with differential connections must have a capacitor placed differentially across the inputs. The differential capacitors must be of high quality. The best ceramic chip capacitors are C0G (NPO), which have stable properties and low noise characteristics.

### 12.2 Layout Example

Figure 80 is an example layout of the ADS1299 requiring a minimum of two PCB layers. The example circuit is shown for either a single analog supply or a bipolar-supply connection. In this example, polygon pours are used as supply connections around the device. If a three- or four-layer PCB is used, the additional inner layers can be dedicated to route power traces. The PCB is partitioned with analog signals routed from the left, digital signals routed to the right, and power routed above and below the device.

*Figure 80. ADS1299 Example Layout — see PDF.*

## 13 Device and Documentation Support

### 13.1 Documentation Support

Related documentation:

- ADS129x Low-Power, 8-Channel, 24-Bit Analog Front-End for Biopotential Measurements
- REF50xx Low-Noise, Very Low Drift, Precision Voltage Reference
- Improving Common-Mode Rejection Using the Right-Leg Drive Amplifier
- ADS1299EEG-FE EEG Front-End Performance Demonstration Kit

### 13.5 Trademarks

E2E is a trademark of Texas Instruments. All other trademarks are the property of their respective owners.

### 13.6 Electrostatic Discharge Caution

This integrated circuit can be damaged by ESD. Texas Instruments recommends that all integrated circuits be handled with appropriate precautions. Failure to observe proper handling and installation procedures can cause damage. ESD damage can range from subtle performance degradation to complete device failure. Precision integrated circuits may be more susceptible to damage because very small parametric changes could cause the device not to meet its published specifications.

## 14 Mechanical, Packaging, and Orderable Information

### Package Option Summary

| Orderable Part Number | Status | Material Type | Package | Pins | Package Qty / Carrier | RoHS | Lead Finish/Ball Material | MSL Rating / Peak Reflow | Op Temp (°C) | Part Marking |
|---|---|---|---|---|---|---|---|---|---|---|
| ADS1299-4PAG     | Active | Production | TQFP (PAG) | 64 | 160 / JEDEC TRAY (10+1) | Yes | NIPDAU | Level-3-260C-168 HR | -40 to 85 | ADS1299-4 |
| ADS1299-4PAG.A   | Active | Production | TQFP (PAG) | 64 | 160 / JEDEC TRAY (10+1) | Yes | NIPDAU | Level-3-260C-168 HR | -40 to 85 | ADS1299-4 |
| ADS1299-4PAGR    | Active | Production | TQFP (PAG) | 64 | 1500 / LARGE T&R       | Yes | NIPDAU | Level-3-260C-168 HR | -40 to 85 | ADS1299-4 |
| ADS1299-4PAGR.A  | Active | Production | TQFP (PAG) | 64 | 1500 / LARGE T&R       | Yes | NIPDAU | Level-3-260C-168 HR | -40 to 85 | ADS1299-4 |
| ADS1299-6PAG     | Active | Production | TQFP (PAG) | 64 | 160 / JEDEC TRAY (10+1) | Yes | NIPDAU | Level-3-260C-168 HR | -40 to 85 | ADS1299-6 |
| ADS1299-6PAG.A   | Active | Production | TQFP (PAG) | 64 | 160 / JEDEC TRAY (10+1) | Yes | NIPDAU | Level-3-260C-168 HR | -40 to 85 | ADS1299-6 |
| ADS1299-6PAGR    | Active | Production | TQFP (PAG) | 64 | 1500 / LARGE T&R       | Yes | NIPDAU | Level-3-260C-168 HR | -40 to 85 | ADS1299-6 |
| ADS1299-6PAGR.A  | Active | Production | TQFP (PAG) | 64 | 1500 / LARGE T&R       | Yes | NIPDAU | Level-3-260C-168 HR | -40 to 85 | ADS1299-6 |
| ADS1299IPAG      | Active | Production | TQFP (PAG) | 64 | 160 / JEDEC TRAY (5+1)  | Yes | NIPDAU | Level-3-260C-168 HR | -40 to 85 | ADS1299    |
| ADS1299IPAG.A    | Active | Production | TQFP (PAG) | 64 | 160 / JEDEC TRAY (5+1)  | Yes | NIPDAU | Level-3-260C-168 HR | -40 to 85 | ADS1299    |
| ADS1299IPAGR     | Active | Production | TQFP (PAG) | 64 | 1500 / LARGE T&R       | Yes | NIPDAU | Level-3-260C-168 HR | -40 to 85 | ADS1299    |
| ADS1299IPAGR.A   | Active | Production | TQFP (PAG) | 64 | 1500 / LARGE T&R       | Yes | NIPDAU | Level-3-260C-168 HR | -40 to 85 | ADS1299    |
| ADS1299IPAGRG4   | Active | Production | TQFP (PAG) | 64 | 1500 / LARGE T&R       | Yes | NIPDAU | Level-3-260C-168 HR | -40 to 85 | ADS1299    |
| ADS1299IPAGRG4.A | Active | Production | TQFP (PAG) | 64 | 1500 / LARGE T&R       | Yes | NIPDAU | Level-3-260C-168 HR | -40 to 85 | ADS1299    |

### Tape and Reel Information (Tape-and-Reel Variants)

All tape-and-reel variants share these dimensions: Reel Diameter 330.0 mm, Reel Width W1 24.4 mm, A0 13.0 mm, B0 13.0 mm, K0 1.5 mm, P1 16.0 mm, W 24.0 mm, Pin 1 Quadrant Q2.

| Device           | Package Type | Package Drawing | Pins | SPQ |
|------------------|--------------|-----------------|------|-----|
| ADS1299-4PAGR    | TQFP         | PAG             | 64   | 1500 |
| ADS1299-6PAGR    | TQFP         | PAG             | 64   | 1500 |
| ADS1299IPAGR     | TQFP         | PAG             | 64   | 1500 |
| ADS1299IPAGRG4   | TQFP         | PAG             | 64   | 1500 |

Tape-and-reel box dimensions: 350.0 mm × 350.0 mm × 43.0 mm.

### Tray Information

All tray variants share these dimensions: Max temperature 150 °C, L 315 mm, W 135.9 mm, K0 7620 µm, P1 15.2 mm, CL 13.1 mm, CW 13 mm. Unit array matrix: 8 × 20.

| Device           | Package | Pins | SPQ |
|------------------|---------|------|-----|
| ADS1299-4PAG     | PAG TQFP | 64 | 160 |
| ADS1299-4PAG.A   | PAG TQFP | 64 | 160 |
| ADS1299-6PAG     | PAG TQFP | 64 | 160 |
| ADS1299-6PAG.A   | PAG TQFP | 64 | 160 |
| ADS1299IPAG      | PAG TQFP | 64 | 160 |
| ADS1299IPAG.A    | PAG TQFP | 64 | 160 |

### Mechanical Outline (PAG package)

64-pin TQFP, S-PQFP-G64, MTQF006A. Body size 10.00 mm × 10.00 mm SQ, package height 1.20 mm max, lead pitch 0.50 mm, lead width 0.17–0.27 mm, total span (lead tip to lead tip) 11.80–12.20 mm SQ. Lead form gull-wing, foot length 0.45–0.75 mm, seating-plane height 0.05 min, lead coplanarity 0.08 max. Pin angle 0°–7°. Falls within JEDEC MS-026.

---

*End of ADS1299, ADS1299-4, ADS1299-6 datasheet text extraction.*
