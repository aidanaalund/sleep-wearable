# nPM1304 Power Management IC — Datasheet v1.0

*Nordic Semiconductor — Document 4548_062 v1.0, March 2026*

> Text extracted from the nPM1304 Datasheet PDF (173 pages). Tables and
> register-bit layouts are preserved as-is from the source. Block diagrams,
> schematics, and other figures are referenced by caption only — see the
> original PDF for visuals.

---

DATASHEET v1.0

nPM1304 Power Management IC
nPM1304 is a highly integrated Power Management IC (PMIC) for rechargeable
applications. It is optimized for small batteries and supports charging current down
to 4 mA. It is design compatible with an nRF52, nRF53, or nRF54 Series System on
Chip (SoC) and third party host devices for developing low-power wireless solutions.
nPM1304 integrates several power and system management features that
significantly reduce cost and footprint. Power is managed through flexible power
regulation and a linear-mode lithium-ion (Li-ion), lithium-polymer (Li-poly), and
lithium iron phosphate (LiFePO4) battery charger in a compact 3.1x2.4 mm CSP or
5x5 mm QFN32 package. A minimum of five passive components are required.
nPM1304 supports charging up to 100 mA and delivers adjustable regulated voltage
to external components from two configurable, dual mode 200 mA BUCK regulators,
and two dual purpose 50 mA LDO/100 mA load switches. An unregulated power rail,
VSYS, delivers up to 100 mA (including BUCK and LDO current consumption) when
powered from battery, or up to 1.5 A when powered from a USB port configured as
DCP. The maximum total current on VSYS is 1.5 A.
The PMIC provides host access to battery temperature, voltage, and current, which
are utilized by a fuel gauge algorithm in the nRF Connect Software Development Kit.
The fuel gauge provides the application with a battery state-of-charge estimate
comparable to Coulomb counters but at a significantly lower power consumption.

Key features

■ 4 mA to 100 mA battery charger
■ Two 200 mA BUCK DC/DC regulators
■ Two 100 mA Load switches or 50 mA LDOs
■ Fuel gauge
■ Hard reset from up to two buttons
■ System-level watchdog and failed boot
recovery

■ Intelligent power-loss warning
■ Five GPIO pins
■ Three LED drivers
■ USB-C compatible
■ Controlled via an I2C compatible TWI
interface

■ Multiple package options
■ 3.1x2.4 mm CSP
■ 5x5 mm QFN32

Nanoamp Ship mode extends battery life during shipping, storage, or device power
off. In active mode, low IQ BUCK regulators use auto-controlled Hysteretic mode for
high efficiency down to 1 µA load currents.

nPM1304
CHARGER
4 mA –100 mA

Fuel Gauge

2x BUCK
200 mA

2x LOADSW/LDO
100 mA/50 mA

SYSTEM
Reset – Watchdog – ADC
5 GPIO pins

3 LEDs

USB-C

TWI

Nordic Semiconductor | nPM1304 Datasheet v1.0

Key features
Features:
• 100 mA linear battery charger

• Two 50 mA LDO/100 mA load switches

• Linear charger for lithium-ion, lithium-polymer, and lithium iron phosphate

• I2C compatible TWI interface for control and monitoring

batteries

• 10-bit ADC for system monitoring

• Configurable charge current from 4 mA to 100 mA

• Configurable charging termination voltage from 3.6 V to 4.65 V

• Configurable thermal regulation

• JEITA compliant

• •

• •

temperature
• Input current limiter
USB Type-C compliant

• 4.0 V to 5.5 V operational input voltage range

• 22 V tolerant

Two 200 mA buck regulators
• Automatic transition between Hysteretic and pulse width modulation
(PWM) modes

• •

Forced PWM mode for low-ripple operation

• Pin-selectable output voltage

Battery voltage, current and temperature monitored by nPM1304

• Nordic Fuel Gauge algorithm running on host System-on-Chip/MCU

Configurable timer
• Boot monitor

• Watchdog timer with selectable reset or power cycling

• Wake-up timer

• General purpose timer

• Power-fail warning (POF)

• Configurable hard reset

• General purpose I/Os that can control BUCKs, load switches,
interrupt output, reset, power fail warning, or as a general
purpose I/O

• Ultra-low power, high accuracy fuel gauge tailored for embedded IoT applications
• Three pre-configured and programmable 5 mA low-side LED
drivers

• Dynamic power-path management

• Measures VBUS voltage, battery voltage, current, and die

Seamless integration and code free configuration with the
nPM1304 Evaluation Kit and nPM PowerUp desktop app

• Package options available:
• 3.1x2.4 mm CSP package

• 5.0x5.0 mm QFN package

Applications:
• Wearables
• Health/fitness sensor and monitoring devices

• Smart rings

• Smart glasses

4548_062 v1.0

• ii

Sports performance trackers

## 1 Revision history

Date

Version

Description

March 2026

1.0

First release

August 2025

0.7

Preliminary release

## 2 About this document

This document is organized into chapters that are based on the modules available in the IC.

### 2.1 Document status

The document status reflects the level of maturity of the document.
Document name

Description

Preliminary Datasheet

Applies to document versions up to 1.0.
This document contains target specifications for
product development.

Datasheet

Applies to document versions 1.0 and higher.
This document contains final product
specifications. Nordic Semiconductor ASA reserves
the right to make changes at any time without
notice in order to improve design and supply the
best possible product.

*Table 1: Defined document names*

### 2.2 Core component chapters

Every core component has a unique capitalized name or an abbreviation of its name, such as LED, used for
identification and reference. This name is used in chapter headings and references, and it will appear in
the C-code header file to identify the component.
The core component instance name, which is different from the core component name, is constructed
using the core component name followed by a numbered postfix, starting with 0. For example, LED0.
A postfix is normally only used if a core component can be instantiated more than once. The core
component instance name is also used in the C-code header file to identify the core component instance.
The chapters describing core components may include the following information:
• A detailed functional description of the core component
• Register configuration for the core component
• Electrical specification tables, containing performance data which apply for the operating conditions
described in Recommended operating conditions on page 13

## 3 Product overview

nPM1304 is a highly integrated Power Management IC (PMIC) for rechargeable applications. It is design
compatible with an nRF52, nRF53, or nRF54 Series System on Chip (SoC) and third party host devices for
developing low-power wireless solutions.
nPM1304 has several power and system management features that can be implemented with dedicated
components. Power management is achieved through flexible power regulation and a linear-mode
lithium-ion (Li-ion), lithium-polymer (Li-poly), and lithium iron phosphate (LiFePO4) battery charger in
a compact 3.1x2.4 mm CSP or 5x5 mm QFN32 package. A minimum of five passive components are
required.
nPM1304 supports charging up to 100 mA and delivers adjustable regulated voltage to external
components from two configurable, dual mode 200 mA BUCK regulators, and two dual purpose 50 mA
LDO/100 mA load switches. An unregulated power rail, VSYS, delivers up to 100 mA (including the current
consumed by the BUCKs and LDOs) when powered from battery, or up to 1.5 A when powered from a USB
port configured as DCP. The maximum total current on VSYS is 1.5 A.
The host can read battery temperature, voltage, and current, which are utilized by a fuel gauge algorithm
in the nRF Connect Software Development Kit. The fuel gauge provides the application with a battery
state-of-charge estimate comparable to Coulomb counters at a significantly lower power consumption.
Low quiescent current (IQ) extends battery life during shipping and storage with Ship mode. Battery life
can also be extended during operation with auto-controlled Hysteretic mode for high efficiency down to 1
µA load currents.
The integrated system management features reduce the cost and size of applications. The following
integrated features are found in the device:
• •
• •
• •

System-level watchdog
Intelligent power-loss warning
Ship and Hibernate modes for increased battery life
Up to 5 GPIO pins and 3 LED drivers
System Monitor
Ultra-low power, high accuracy fuel gauge tailored for embedded IoT applications

System management features and I/Os are configured through an I2C compatible two-wire Interface (TWI).
The nPM1304 Evaluation Kit provides simple evaluation and code-free configuration of nPM1304.
Connecting to the nPM PowerUP app found in nRF Connect for Desktop enables the nPM1304 settings
to be easily configured through an intuitive GUI and exported as code to be implemented in your MCU's
application.

### 3.1 Block diagram

The block diagram illustrates the overall system.

nPM1304

LOADSW1/
LDO1
100 mA/50 mA

LSOUT2/
VOUTLDO2

LSIN2/
VINLDO2

LSOUT1/
VOUTLDO1

LSIN1/
VINLDO1

Product overview

LOADSW2/
LDO2
100 mA/50 mA
VSYS

VBUS
VBUSOUT
CC1

SYSREG

PVDD

System
regulator
1500 mA

SW1

CC2
BUCK1
VBAT

200 mA

VOUT1
VSET1
PVSS1

NTC

CHARGER

AVSS

100Li-Ion
mA
1.1A
Charger
Li-ion
Li-poly
LiFePO4

+

BATTERY PACK

SW2
BUCK2
200 mA

VOUT2
VSET2
PVSS2

SHPHLD

SCL
TWI

VDDIO

LEDDRV

GPIO

GPIO[n]

LED[n]

SDA

*Figure 1: Block diagram*

#### 3.1.1 In-circuit configurations

The device is configurable for different applications and battery characteristics through input pins.
The following pins must be configured before power-on reset. For the full pin list, see Pin assignments on
page 150.

Product overview
Pin

Function

Reference

VDDIO

Supply for the TWI control interface and GPIOs

Interface supply on page
120, GPIO — General
purpose input/output on
page 83

VSET1

BUCK1 enable and VOUT1 voltage level selection at BUCK — Buck regulators
power-on reset
on page 42

VSET2

BUCK2 enable and VOUT2 voltage level selection at BUCK — Buck regulators
power-on reset
on page 42

CC1, CC2

USB charger detection (USB Type-C)

USB port detection on
page 15

*Table 2: In-circuit configurations*

### 3.2 System description

The device has the following core components that are described in detail in their respective chapters.
• •
• •
• •

SYSREG — System regulator on page 15
CHARGER — Battery charger on page 22
BUCK — Buck regulators on page 42
LOADSW/LDO — Load switches/LDO regulators on page 67
LEDDRV — LED drivers on page 79
GPIO — General purpose input/output on page 83

The system regulator (SYSREG) is supplied by VBUS. It supports 4.0 V to 5.5 V for internal functions and
tolerates transient voltages up to 22 V. Overvoltage protection is implemented for both internal and
external circuitry. SYSREG also implements current limiting for VBUS to comply with the USB Type-C
specification. SYSREG supports Type-C charger detection.
The battery charger (CHARGER) is a JEITA compliant linear battery charger for lithium-ion (Li-ion), lithiumpolymer (Li-poly), and lithium iron phosphate (LiFePO4) batteries. CHARGER controls the charge cycle
using a standard Li-ion charge profile. CHARGER implements dynamic power-path management regulating
current in and out of the battery, depending on system requirements, to ensure immediate system
operation from VBUS if the battery is depleted. Safety features, such as battery temperature monitoring
and charger thermal regulation are supported.
Two independent, highly efficient buck regulators (BUCK) supply the application circuitry and offer several
output voltage options. BUCK is controlled through registers or GPIO pins. Default output voltage can be
set with external resistors.
The two load switches (LOADSW/LDO) can function as switches or linear voltage regulators to complement
the power distribution network. LOADSW/LDO is controlled through registers or GPIO pins.
The System Monitor provides measurements for battery voltage, battery current, VBUS, battery, and die
temperature.
GPIO has the following configurable features:
• •
• •
• General purpose input
Control input
Output
BUCK[n] control
LOADSW[n] control

Product overview
The device also features Ship and Hibernate modes, the lowest quiescent current states. They disconnect
the battery from the system and reduce the quiescent current of the device to extend battery life.
Hibernate mode can be utilized during normal operation as the device can autonomously wake-up after a
preconfigured timeout. This makes it possible to extend battery life to the maximum capacity.

### 3.3 Power-on reset (POR) and brownout reset (BOR)

The device is supplied by VBUS or VBAT.
When one of the following conditions are met, a power-on reset (POR) occurs.
• VBUS > VBUSPOR
• VBAT > VBATPOR
When both of the following conditions are met, a brownout reset (BOR) occurs.
• VBUS < VBUSBOR
• VBAT < VBATBOR

### 3.4 Supported battery types

The charger supports rechargeable Li-ion, Li-polymer, or LiFePO4 batteries.
Battery packs connected to the VBAT pin must contain the following protection circuitry:
• •
• •

Overvoltage protection
Undervoltage protection
Overcurrent discharge protection
Thermal fuse to protect from overtemperature (if NTC thermistor is not present)

### 3.5 Thermal protection

A global thermal shutdown is triggered when the die temperature exceeds the operating temperature
range, see TSD. All device functions are disabled in thermal shutdown. The device functions are re-enabled
when the temperature is sufficiently reduced according to a hysteresis TSDHYST. The die temperature limit
is only monitored when charging is enabled or when a BUCK is enabled and is in PWM mode.
A secondary mechanism disables the charger when the die reaches the host software programmable
temperature of DIETEMPSTOP on page 39 . Once this temperature is reached, charging stops but all
other functionality remains active. Charging restarts when the die temperature reaches the host software
programmable temperature of DIETEMPRESUME on page 39.

### 3.6 System efficiency

Shown here is the characterization of the power path system efficiency under different load current
conditions.
In the following figure, the load current is swept from 100 nA to 200 mA and back to capture mode change
hysteresis.

Product overview

*Figure 2: VOUT = 3.3 V system efficiency, MODE = AUTO, VIN = 3.8 V*

### 3.7 Electrical characteristics

The following graphs show quiescent current characteristics.

*Figure 3: SHIP mode current vs. junction temperature*

Product overview

*Figure 4: Discharge mode current vs. junction temperature*

### 3.8 System electrical specification

Product overview
Symbol

Description

Min.

Typ.

Max.

IQSHIP

Ship mode quiescent current

370

nA

IQSHIPT

Hibernate mode quiescent
current

500

nA

IQBAT

Quiescent current, battery
operation, all BUCKs and
LDOs disabled, VBUS
disconnected

600

nA

Quiescent current, battery
operation, one BUCK
enabled in Auto mode, no
load, VBUS disconnected

800

nA

Quiescent current, battery
operation, both BUCKs
enabled in Auto mode, no
load, VBUS disconnected

1100

nA

Quiescent current, battery
operation, one BUCK
enabled in PWM mode,
VOUT=1.8 V, no load, VBUS
disconnected

4.0

mA

Quiescent current, battery
operation, both BUCKs
enabled in PWM mode,
VOUT=1.8 V, no load, VBUS
disconnected

7.1

mA

IQBATFULL

Quiescent current (from
battery), VBUS=5 V, battery
fully charged, no BUCK load

4

μA

TSD

Thermal shutdown
threshold

120

°C

TSDHYST

Thermal shutdown
hysteresis

20

°C

IOUTVSYS

Maximum VSYS DC load
current when powered
from battery (VBUS=0 V,
VSYS>VSYSPOF)

100

mA

Maximum VSYS DC load
current when powered from
VBUS, or from both VBUS
and battery (VBUS=5 V,
VSYS>VSYSPOF)

1.5

A

*Table 3: System electrical specification*

4548_062 v1.0

11

Unit

## 4 Absolute maximum ratings

Maximum ratings are the extreme limits to which the device can be exposed for a limited amount of time
without permanently damaging it. Exposure to absolute maximum ratings for prolonged periods of time
may affect the reliability of the device.
Pin

Note

VBUS

Power (relative to pins
AVSS, PVSS1, and
PVSS2)

-0.3

22

V

Power (relative to pins
AVSS, PVSS1, and
PVSS2)

-0.3

5.5

V

Analog pins (relative
to pins AVSS, PVSS1,
and PVSS2)

-0.3

5.5

V

Digital pins (relative
to pins AVSS, PVSS1,
and PVSS2)

-0.3

VDDIO+0.3

V

VBAT, VSYS, PVDD, VDDIO
NTC, CC1, CC2, SHPHLD, LED0,
LED1, LED2, LSIN1/VINLDO1,
LSOUT1/VOUTLDO1, LSIN2/
VINLDO2, LSOUT2/VOUTLDO2,
VSET1, VSET2, VBUSOUT, VOUT1,
VOUT2, SW1, SW2
GPIO[0..4], SDA, SCL

Min.

Max.

Unit

*Table 4: Absolute maximum ratings*

Note

Min.

Storage
temperature

Max.
-40

Unit

+125

°C

MSL QFN

Moisture sensitivity level

2

MSL CSP

Moisture sensitivity level

1

ESD HBM

Human Body Model Class 2

2

kV

ESD CDM

Charged Device Model

500

V

*Table 5: Environmental ratings*

## 5 Recommended operating conditions

The operating conditions are the physical parameters that the chip can operate within.
Symbol

Description

Min.

Max

Unit

VBUSOP

Supply voltage

4.0

5.5

V

VBATOP

Battery voltage

2.3

4.65

V

VDDIO

I/O supply voltage

1.7

VSYS

V

TJ

Junction temperature

-40

+125

°C

TA

Ambient temperature

-40

+85

°C

*Table 6: Recommended operating conditions*

Note: Any system features powered by VSYS will only operate when the VSYS voltage > VSYSPOF.

### 5.1 Dissipation ratings

Thermal resistances and thermal characterization parameters as defined by JESD51-7 are shown in the
following tables.
Symbol

Parameter

QFN 32 pins

Units

RϴJA

Junction-to-ambient thermal resistance

24.2

°C/W

RϴJC(top)

Junction-to-case (top) thermal resistance

10.7

°C/W

RϴJB

Junction-to-board thermal resistance

8.8

°C/W

ΨJT

Junction-to-top characterization parameter

0.15

°C/W

ΨJB

Junction-to-board characterization parameter

8.9

°C/W

*Table 7: QFN32 thermal resistance and characterization parameters*

Symbol

Parameter

CSP 35 pins

Units

RϴJA

Junction-to-ambient thermal resistance

48.3

°C/W

RϴJC(top)

Junction-to-case (top) thermal resistance

6.0

°C/W

RϴJB

Junction-to-board thermal resistance

23.0

°C/W

ΨJT

Junction-to-top characterization parameter

0.5

°C/W

ΨJB

Junction-to-board characterization parameter

23.4

°C/W

*Table 8: CSP thermal resistance and characterization parameters*

Recommended operating conditions

### 5.2 CSP light sensitivity

The CSP package is sensitive to light.
All CSP package variants are sensitive to visible and close-range infrared light. The final product design
must shield the chip through encapsulation or shielding/coating the CSP device.
CSP package variant CAAA has a backside coating that covers the marking side of the device with a light
absorbing film. The side edges and the ball side of the device are still exposed and need to be protected.

## 6 Core Components

### 6.1 SYSREG — System regulator

VBUS supplies the input voltage to the system regulator (SYSREG). VBUS voltage is supplied by an AC wall
adapter or a USB port.
SYSREG supplies VSYS.
Features of SYSREG are the following:
• •
• •
• Operating voltage up to 5.5 V
Overvoltage protection to 22 V
Undervoltage detection
USB port detection and a current limiter to comply with the USB specification
Provides VBUSOUT voltage for host devices

#### 6.1.1 VBUS input current limiter

The VBUS input current limiter manages VBUS current limitation and charger detection for USB Type-C
compatible chargers.
It supplies VSYS but does not regulate its voltage. VBUS voltage is seen at VSYS as a supply, if the VBUS
voltage is within specified limits and higher than VBAT by at least VBUSVALID.
There are two USB compliant, accurate current limits: IBUS100MA (100 mA) and IBUS500MA (500 mA).
In addition, there are current limits in 100 mA steps from 600 mA to 1500 mA. The 1500 mA limit is
compatible with USB Type-C.
The default current limit is IBUS100MA (100 mA). Host software can configure the current in register
VBUSINILIM0 on page 19. When TASK.UPDATE.ILIMSW is written, VBUSIN.LIM0 takes effect.

#### 6.1.2 VBUS overvoltage protection

The overvoltage threshold for VBUS is VBUSOVP. The undervoltage threshold for VBUS is VBUSMIN.
SYSREG is disabled when VBUSvoltage is above the overvoltage threshold VBUSOVP, or below the
undervoltage threshold VBUSMIN. This isolates VBUS and prevents current flowing from VSYS to VBUS.

#### 6.1.3 USB port detection

USB charger detection is performed through pins CC1 and CC2. These pins must be connected directly to
the USB connector for detection to happen.
These pins have internal pull-downs with resistance equal to Rd.
When the device is plugged into a wall adaptor or USB power source, USB port detection runs
automatically. One of the CC lines is connected to a pull-up at the source. The other CC line stays pulled
down. The voltage over the corresponding Rd determines if a connection was made and if SYSREG can
deliver 500 mA or higher current.
Comparators with thresholds at VRDCONN, VRD1A5, and VRD3A monitor CC line voltage when VBUS is
present. All comparator output is debounced with tRDDEB and available to host software through register
USBCDETECTSTATUS on page 20.

Core Components
If enabled, an interrupt is issued to the host whenever a threshold is crossed (when voltage decreases or
increases). The events are visible in register EVENTSVBUSIN1SET on page 139.
The USB power source capability is detected by one CC line at a time, depending on the orientation
of the USB plug on the device. The other CC line remains at 0 V. The charger type is defined in the
VBUSIN.CC1CMP or VBUSIN.CC2CMP field, depending on which pin is used for connection.
The default VBUS current limit of 100 mA is used until the power source capability is detected. Host
software can update the VBUS current limit in VBUSINILIM0 on page 19 after device detection. When a
USB cable is unplugged and plugged back in, or a reset occurs, the default current limit is used.
When TASK.UPDATE.ILIMSW is written, VBUSIN.LIM0 takes effect. The VBUS current limit reverts to its
default value (100 mA) when the following occur:
• A reset
• The USB cable is unplugged and plugged back in
If USB Type-C configuration is not used, CC1 and CC2 can be left floating or connected to ground. The
default VBUS current limit will remain at 100 mA until the host negotiates and configures a higher current.
Note: Overvoltage or undervoltage events may occur when connecting or removing a supply to
VBUS.

#### 6.1.4 USB2.0 Selective Suspend

The device can satisfy USB2.0 Selective Suspend mode current consumption through configuration. It
must be informed by host software through the TWI in register VBUSSUSPEND on page 20 to minimize
current consumption from VBUS to ISUSP.
The current consumed through pin VBUSOUT is not included. VBUS is disconnected from VSYS but
VBUSOUT remains active. As a consequence, charging is paused. The device exits this mode only when
instructed by the host software through a TWI command. Charging resumes automatically.

#### 6.1.5 VBUSOUT

The device supplies VBUSOUT voltage when VBUS voltage is present and higher than VBAT by at least
VBUSVALID.
VBUSOUT provides overvoltage and undervoltage protection for safe connection to the nRF device.
Designs using the VBUSOUT pin as a supply must make sure the voltage level complies with the nRF
device due to output resistance RVBUSOUT. When USB is suspended, the combined current for nPM1304
and the VBUSOUT pin must be within the allowed USB suspend current.
VBUSOUT must have a decoupling capacitor. The capacitor is discharged by RPDVBUSOUT once VBUS has
been disconnected.

#### 6.1.6 Electrical specification

Core Components
Symbol

Description

Min.

VBUSOVP

Overvoltage protection threshold

5.5

V

VBUSVALIDR

VBUS valid threshold, VBUS - VBAT, VBUS
rising

210

mV

VBUSVALIDF

VBUS valid threshold, VBUS - VBAT, VBUS
falling or VBAT rising

160

mV

VBUSPOR

Power-on reset release voltage for VBUS

3.9

V

VBUSBOR

Brownout reset trigger for VBUS with VBAT
not present

3.8

V

VBUSMIN

Undervoltage threshold with VBAT present

3.6

V

IBUS100MA

VBUS input current limit, 100 mA 1

95

mA

IBUS500MA

VBUS input current limit, 500 mA 1

495

mA

IBUSLIMACC

Accuracy of IBUS current limit (steps from

+10

%

1

Typ.

-10

Max.

Unit

600 to 1500 mA)
ISUSP

VBUS current consumption in suspend
mode

1.8

mA

300

mΩ

7.5

Ω

Current from VBUSOUT is excluded
RON

Resistance between VBUS and VSYS
VBUSINLIM0 = 15 (1.5 A)
VBUS = 5 V

RVBUSOUT

On resistance of the VBUSOUT switch
VBUS = 5.0 V

Rd

Pull-down resistance on pins CC1 and CC2

5.1

kΩ

VRDCONN

Threshold to detect connection

0.2

V

VRD1A5

Threshold to detect charger type on CC1
or CC2 pins

0.66

V

VRD3A

Threshold for 3 A current limit

1.23

V

RPDVBUSOUT

Pull-down resistor on VBUSOUT pin when
VBUS is disconnected.

35

kΩ

tRDDEB

Debounce time for CC voltage level
detection

15

ms

*Table 9: SYSREG electrical specification*

1

Includes internal device consumption and current flowing through pin VBUSOUT.

#### 6.1.7 Electrical characteristics

The following graphs show typical electrical characteristics for VBUSIN.

Core Components

*Figure 5: VSYS voltage vs. VBUS current, ILIM = 100 mA*

*Figure 6: VSYS voltage vs. VBUS current, ILIM = 500 mA*

#### 6.1.8 Registers

Instances
Instance

Base address

Description

VBUSIN

0x00000200

VBUSIN registers
VBUSIN register map

Core Components

Register overview
Register

Offset

Description

TASKUPDATEILIMSW

0x0

Select input current limit

VBUSINILIM0

0x1

Configure input current limit

VBUSINILIMSTARTUP

0x2

Configure input current limit for startup

VBUSSUSPEND

0x3

Enable suspend mode

USBCDETECTSTATUS

0x5

Status of charger detection

VBUSINSTATUS

0x7

Status register

LDOSOFTSTARTCFG

0x8

LDO soft start configuration (valid for Build code B00 and later)

##### 6.1.8.1 TASKUPDATEILIMSW

Address offset: 0x0
Select input current limit
Bit number

7

6 5 4 3 2 1 0

ID

A

Reset 0x00

0

ID

R/W Field

A

W

0 0 0 0 0 0 0

Value ID

Value

Description

NOEFFECT

0

No effect

SELVBUSILIM0

1

Use VBUSINLIM0. VBUS removal switches back to VBUSINLIMSTARTUP

TASKUPDATEILIM

Switch from VBUSINLIMSTARTUP to VBUSINLIM0

##### 6.1.8.2 VBUSINILIM0

Address offset: 0x1
Configure input current limit
Bit number

7

ID

6 5 4 3 2 1 0
A A A A

Reset 0x01

0

ID

R/W Field

A

RW

Value ID

Value

Description

500MA0

0

500 mA

100MA

1

100 mA

200MA

2

200 mA

300MA

3

300 mA

400MA

4

400 mA

500MA

5

500 mA

600MA

6

600 mA

700MA

7

700 mA

800MA

8

800 mA

900MA

9

900 mA

1000MA

10

1000 mA

1100MA

11

1100 mA

1200MA

12

1200 mA

1300MA

13

1300 mA

1400MA

14

1400 mA

1500MA

15

1500 mA

VBUSINILIM0

4548_062 v1.0

Input current limit for VBUS selected by host

19

0 0 0 0 0 0 1

Core Components

##### 6.1.8.3 VBUSINILIMSTARTUP

Address offset: 0x2
Configure input current limit for startup
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 1

7

6 5 4 3 2 1 0

ID

A A A A

Reset 0x01
ID

R/W Field

A

RW

Value ID

Value

Description

500MA0

0

500 mA

100MA

1

100 mA

200MA

2

200 mA

300MA

3

300 mA

400MA

4

400 mA

500MA

5

500 mA

600MA

6

600 mA

700MA

7

700 mA

800MA

8

800 mA

900MA

9

900 mA

1000MA

10

1000 mA

1100MA

11

1100 mA

1200MA

12

1200 mA

1300MA

13

1300 mA

1400MA

14

1400 mA

1500MA

15

1500 mA

VBUSINILIMSTARTUP

Default input current limit for VBUS

##### 6.1.8.4 VBUSSUSPEND

Address offset: 0x3
Enable suspend mode
Bit number
ID

A

Reset 0x00

0

ID

R/W Field

A

RW

Value ID

Value

Description

VBUSSUSPENDENA

Control suspend mode
NORMAL

0

Normal mode

SUSPENDMODE

1

Suspend mode

##### 6.1.8.5 USBCDETECTSTATUS

Address offset: 0x5
Status of charger detection

4548_062 v1.0

20

0 0 0 0 0 0 0

Core Components
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

ID

B B A A

Reset 0x00
ID

R/W Field

A

R

B

R

Value ID

Value

Description

NOCONNECTION

0

No connection

DEFAULTUSB

1

Default USB 100/500 mA

1A5HIGHPOWER

2

1.5 A high power

3AHIGHPOWER

3

3 A high power

VBUSINCC1CMP

CC1 charger detection

VBUSINCC2CMP

CC2 charger detection
NOCONNECTION

0

No connection

DEFAULTUSB

1

Default USB 100/500 mA

1A5HIGHPOWER

2

1.5 A high power

3AHIGHPOWER

3

3 A high power

##### 6.1.8.6 VBUSINSTATUS

Address offset: 0x7
Status register
Bit number
ID

F E D C B A

Reset 0x00
ID

R/W Field

A

R

B

C

D

E

F

R

R

R

R

R

Value ID

Value

Description

NOTDETECTED

0

Not present

DETECTED

1

Present

VBUSINPRESENT

VBUS present

VBUSINCURRLIMACTIVE

VBUS current limit

NOTDETECTED

0

Not active

DETECTED

1

Active

VBUSINOVRPROTACTIVE

VBUS overvoltage

NOTACTIVE

0

Not active

ACTIVE

1

Active

VBUSINUNDERVOLTAGE

VBUS undervoltage

NOTDETECTED

0

Not detected

DETECTED

1

Detected

VBUSINSUSPENDMODEACTIVE

Suspend mode

NORMAL

0

Normal

SUSPEND

1

Suspend

VBUSINVBUSOUTACTIVE

VBUSOUT pin

NOTACTIVE

0

Not active

ACTIVE

1

Active

##### 6.1.8.7 LDOSOFTSTARTCFG

Address offset: 0x8
LDO soft start configuration (valid for Build code B00 and later)

Core Components
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

ID

B A

Reset 0x00
ID

R/W Field

A

RW

Value ID

Value

Description

LDO1SOFTSTARTENABLE

LDO1 soft start enable (Note! LDO soft start can be enabled only when
LDSW.LDSW1LDOSEL.LDSW1LDOSEL=0)

B

RW

LOADSW1

0

Load switch 1

LDO1SOFTSTART

1

LDO1 with soft start

LDO2SOFTSTARTENABLE

LDO2 soft start enable (Note! LDO soft start can be enabled only when
LDSW.LDSW2LDOSEL.LDSW2LDOSEL=0)

LOADSW2

0

Load switch 2

LDO2SOFTSTART

1

LDO2 with soft start

### 6.2 CHARGER — Battery charger

The battery charger is suitable for general purpose applications with lithium-ion (Li-ion), lithium-polymer
(Li-poly), and lithium iron phosphate (LiFePO4) batteries. The following sections describe how to configure
CHARGER to match the battery type.
The main features of the battery charger are the following:
• •
• •
• Linear charger for Li-ion, Li-poly, and LiFePO4 battery chemistries
Bidirectional power FET for dynamic power-path management
Automatic trickle, constant current, constant voltage, and end-of-charge/recharge cycle
Maintains VBUS current below programmed limit
JEITA compliant with a configurable battery charging temperature profile

Charging is configured and enabled through host software. The voltage and charging current are
configurable and the device manages the charging cycle after the charging parameters are defined.
VTERM must be set to a lower voltage than the battery overvoltage protection.

#### 6.2.1 Charging cycle

Host software enables charging through register BCHGENABLESET on page 34. Battery charging starts
when VBUS voltage is present and higher than VBAT by at least VBUSVALIDR. Charging stops in case VBUSVBAT is less than VBUSVALIDF either because VBUS drops or VBAT rises. Once charging has started, host
software must use register EVENTSBCHARGER0CLR on page 127 to initialize battery charger events.
When charging is enabled, charging will not start if the battery voltage is less than VBATLOW. Charging
batteries with a voltage lower than VBATLOW is enabled by setting register BCHGVBATLOWCHARGE on
page 42. When charging starts, it enters trickle charging. Constant current charging starts when the
battery voltage is above VTRICKLE_FAST. After the battery voltage reaches VTERM, the charger enters constant
voltage charging. The battery voltage is maintained while monitoring current flow into the battery. When
the current into the battery drops below ITERM, charging is complete. Charging is disabled using register
BCHGENABLECLR on page 34.
If charging is enabled on a fully charged battery, up to 100 ms of trickle charge and up to 4 ms of constant
current charging is applied.

Core Components

Host software configures
charging parameters

VBUS connect event

Interrupt
to host

Trickle charging
VBAT ≥ V TRICKLEFAST

Constant current charging
VBAT ≥ V TERM

Constant voltage charging
IBAT ≤ I TERM

Charging complete
VBAT < V RECHARGE
Interrupt to host

Optional automatic recharge

*Figure 7: Charging cycle flow chart*

V

I

VTERM

VTRICKLE_FAST

ICHG
ITRICKLE
ITERM

t
Trickle
charge

Constant voltage charge Charging complete
Constant
current charge

*Figure 8: Charging cycle*

Note: Events EVENTBATDETECTED and EVENTBATLOST and status bit BATTERYDETECTED are not
available.
Note: When attempting to start charging when VBUS is present but no battery is connected, the
host software will see repeated charger events (such as EVENTCHGCOMPLETED).

Core Components

#### 6.2.2 Termination voltage (VTERMSET)

VTERM is configured through TWI according to the battery type in use, see register BCHGVTERM on page
35.
For a higher battery temperature range, a lower termination voltage (VTERMR) is available and configured
separately in register BCHGVTERMR on page 36. VTERM and VTERMR can be set to the same value.

#### 6.2.3 Charge current limit (ICHG)

The charge current limit is set between 4 mA and 100 mA in 0.5 mA steps. Charging current ICHG is
configured with TWI with a default value of 4 mA.
Note: Do not configure the charge current outside this range as this might lead to instability issues.
CHARGER must be disabled before changing the current setting in register BCHGISET on page 35 . The
setting takes effect when charging is enabled.
The following shows how the register value can be calculated, where ICHG is the charge current in mA:
Trickle charging current, ITRICKLE, is 10% of ICHG. Trickle charging is active when VBAT < VTRICKLE_FAST (default
2.9 V).
Termination current, ITERM, is programmable to 10% (default) or 5% of ICHG. Termination current is active in
the constant voltage phase of charging. Charging stops when the charging current reduces to this value.
These parameters are configured in registers BCHGVTRICKLESEL on page 36 and BCHGITERMSEL on
page 37.

#### 6.2.4 Monitor battery temperature

CHARGER supports three types of NTC thermistors for battery temperature (TBAT) monitoring. Only one
can be enabled at a time.
The host software must select the corresponding setting that matches the battery thermistor before
enabling charging in register ADCNTCRSEL on page 103. The following thermistor resistors are
supported.
Nominal resistance Resistance
accuracy

B25/50

Beta accuracy

B25/85

10 kΩ

1%

3380 K

1%

3434/3435 K

47 kΩ

1%

4050 K

1%

4108 K

100 kΩ

1%

4250 K

1%

4311 K

*Table 10: Supported thermistor resistors*

Note: If a capacitor is placed in parallel with the thermistor, the max capacitance is 100 pF.
If a thermistor is not used, the NTC pin must be tied directly to ground or through a resistor. The
functionality must be disabled in register BCHGDISABLESET on page 34. This does not impact Charger
thermal regulation on page 26.
The following battery temperature thresholds can be set: TCOLD ≤ TCOOL ≤ TWARM ≤ THOT.
These limits can be set between −20°C and +60°C, and setting adjacent thresholds to identical values
is allowed. For example, setting TWARM = THOT means that there is no warm region. Charging does not

Core Components
happen below TCOLD or above THOT. Charging can be paused at TWARM instead of THOT by setting register
BCHGCONFIG on page 41.
The thresholds are written into corresponding registers. The battery temperature variable, KNTCTEMP, is
calculated using the following equation:

Here, RT is the thermistor resistance at a desired temperature and RB (internal bias resistor) equals the
thermistor resistance at 25°C. See NTCCOLD on page 37, NTCCOOL on page 37, NTCWARM on page
38, and NTCHOT on page 38 for more information. Default values in the registers match the JEITA
guideline and are intended for the 10 kΩ thermistor defined in Supported thermistor resistors on page
24.
Temp.

10 kΩ

47 kΩ

100 kΩ

Register

0°C

749

787

799

NTCCOLD

10°C

658

684

693

NTCCOOL

45°C

337

306

297

NTCWARM

60°C

237

197

186

NTCHOT

*Table 11: Battery temperature default values*

The charging current can be reduced by 50% between NTCCOLD and NTCCOOL. The termination voltage
can be configured independently between NTCWARM and NTCHOT. Default is ICOOL (50% of ICHG), but this
can be disabled.
Temperature
region

Temperature limits, default setting

Charge current

Termination
voltage

Cold

TBAT < TCOLD

0 (OFF)

N/A

ICOOL / ICHG

VTERM

ICHG

VTERM

ICHG

VTERMR

0 (OFF)

N/A

TCOLD = 0°C
Cool

TCOLD < TBAT < TCOOL
TCOOL = 10°C

Nominal

TCOOL < TBAT < TWARM
TWARM = 45°C

Warm

TWARM < TBAT < THOT
THOT = 60°C

Hot

TBAT > THOT

*Table 12: Battery temperature regions*

Battery temperature is measured by the on-chip System Monitor at regular intervals during charging. The
latest result is available in registers ADCNTCRESULTMSB on page 105 and ADCGP0RESULTLSBS on page
105.
When the battery temperature rises over TWARM or THOT, or falls below TCOOL or TCOLD, an interrupt is sent.

Core Components

#### 6.2.5 Charger thermal regulation

Heat dissipation from the linear charger is managed by setting a maximum temperature limit for the die.
This limit must not exceed device and PCB temperature requirements.
To enable automatic thermistor and die temperature monitoring during charging, set register
TASKAUTOTIMUPDATE on page 104. This should also be set after setting the automated period.
Die temperature monitoring has a default limit of TCHGSTOP. Charging stops when the die temperature
reaches the limit. It resumes when the die cools down to TCHGRESUME.
TCHGSTOP controls the junction temperature rise and limits the temperature rise on the PCB and device
mechanics. The device can be configured to send an interrupt when the limit is met.
The die temperature variable, KDIETEMP, is calculated with the following equation:

Here, TD represents the die temperature limit in degrees Celsius.
Registers DIETEMPSTOP on page 39 and DIETEMPSTOPLSB on page 39 are concatenated to create
a 10-bit value that defines the charging stop temperature TCHGSTOP. Registers DIETEMPRESUME on page
39 and DIETEMPRESUMELSB on page 39 are concatenated to create a 10-bit value that defines
the charging resume temperature TCHGRESUME. The host software reads register DIETEMPSTATUS on page
40 to determine if the die temperature is above TCHGSTOP.
The following table consists of die temperature value examples.
KDIETEMP

TD
435

50°C

422

60°C

410

70°C

397

80°C

384

90°C

372

100°C

359

110°C

*Table 13: Die temperature example*

#### 6.2.6 Charger error conditions

A CHARGER error condition occurs when one of the following are present:
• Trickle charge timeout, see tOUTTRICKLE
• Safety timer expires, see tOUTCHARGE
After an error is detected, charging is disabled. The charging error indication is activated and the charging
indication is deactivated. Error conditions are cleared when VBUS is disconnected and reconnected again.
Errors are reported in register BCHGERRREASON on page 41 and BCHGERRSENSOR on page 41.
Host software clears errors with register TASKCLEARCHGERR on page 33 and releases the charger from
the error state with register TASKRELEASEERR on page 33.
When the safety timer expires, the host must make sure it is safe to charge before resetting register
TASKCLEARSAFETYTIMER on page 33.

Core Components

#### 6.2.7 Charging status and error indication

When CHARGER is enabled and the LEDs are configured, the LEDs indicate the charging status.
The LED[n] pins sink 5 mA of current when active. They are high impedance when disabled. This is
suitable for driving LEDs or connecting to host GPIOs in a weak pull-up configuration. The LED anode must
be connected to a voltage rail that allows forward bias. If a general purpose open drain output is needed,
the LED pins can be used with a pull-up resistor connected to a voltage rail. See LEDDRV — LED drivers on
page 79 for more information.

Charging status
Charging status is available in register BCHGCHARGESTATUS on page 40.
LED drivers are configured through TWI to indicate if charging is active or charging is complete.
The charging indication turns off when charging is complete. It turns on when charging starts. The charging
indication is off when CHARGER is disabled temporarily due to die temperature exceeding the configured
limit.
The charging indication is off when battery temperature is below cold or above hot thresholds. No error is
indicated in these cases. The charging indication is off when VBUS > VBUSOVP and no error is indicated.

Error indications
Errors are reported in register BCHGERRREASON on page 41 and BCHGERRSENSOR on page 41.

#### 6.2.8 End-of-charge and recharge

Charging terminates automatically when the battery voltage reaches VTERM and charging current is less
than ITERM. An interrupt is issued to the host.
Unless disabled through bit DISABLE.RECHARGE, charging restarts automatically when VBAT is less than
VRECHARGE and an interrupt is sent to the host.

#### 6.2.9 Dynamic power-path management

CHARGER manages battery current flow to maintain VSYS voltage.

The battery is isolated when VBUS is connected and the battery is fully charged. Under this condition,
VBUS supplies VSYS. When VBUS is disconnected, VSYS is supplied by its decoupling capacitors until it is
connected to VBAT. The connection is triggered by VSYS reaching VSYSBELOW_VBAT level and is completed
within tSWITCH.
After VBUS has been connected (and debounced), VSYS is disconnected from VBAT and supplied by its
decoupling capacitors until supplied by VBUS, which happens within tSWITCH.
The system load requirements are prioritized over battery charge current when VBUS is connected
and the battery is charging. During charging, if the system current load exceeds IBUSLIM, the battery
charge current decreases to maintain the VSYS voltage. CHARGER reduces the current to maintain an
internal voltage of VCHDROPOUT above the VBAT voltage. If more current is required, CHARGER enters the
SUPPLEMENT state to provide current from the battery, up to IBATLIM.
Note: VSYS must not be supplied from an external source.

#### 6.2.10 Battery discharge current limit

The discharge current limit is IBATLIM.

Core Components
If the system load exceeds the discharge current limit, VSYS voltage drops below VSYSPOF causing the
device to reset, as described in POF — Power-fail comparator on page 107.
Note: The discharge current limit has been primarily designed to protect the device from
overcurrent conditions, such as a short circuit on VSYS. It has not been designed for accurate
current limiting.

#### 6.2.11 Electrical specification

Core Components
Symbol

Description

VBATPOR

VBAT power-on reset release voltage

2.75

V

VBATBOR

VBAT brownout reset trigger

2.4

V

VBATLOW

Minimum VBAT voltage for charging

2.1

V

VRECHARGE

Battery voltage level needed to restart
charging, % of VTERM

95

%

VTERMACC

Accuracy of termination voltage
VBUS = 5.0 V
TJ > 0°C

VTERM

Range of termination voltage

VTERMR

Min.

Typ.

Max.

-1

Range of termination voltage for NTCHOT >
T > NTCWARM

+1

Unit

%

3.60
3.65
4.00 to
4.65

V

3.60
3.65
4.00 to
4.65

V

VTERM_STEP

Termination voltage step size

50

mV

ICHG

Range of constant currents

4 to 100

mA

ICHGACC

Constant current accuracy

ICHGSTEP

Charging current step

0.5

mA

ITRICKLE

Trickle charging current, % of ICHG

10

%

ICOOL

Reduced charging current, % of ICHG

50

%

ITERM

Termination current, % of ICHG

10
5

%

VTRICKLE_FAST

Default threshold where trickle charging
stops and constant current charging starts

2.9

V

VCHDROPOUT

Charger dropout voltage

60

mV

IBATLIM

Discharging battery current limit

RONCHARGER

Resistance between pins VBAT and VSYS

550

mΩ

VSYSBELOW_VBAT VSYS below VBAT comparator threshold,
VBAT - VSYS, VSYS falling

75

mV

-10

10

1001

%

mA

751

tSWITCH

Dynamic power-path switching time
(2.8 V < VBAT < 5.5 V)

TACC

Temperature accuracy when using
suggested NTC

±2

°C

TCHGSTOP

Die temperature where charging stops
(default)

110

°C

TCHGRESUME

Die temperature where charging resumes
(default)

100

°C

tOUTTRICKLE

Trickle charging timeout

10

min

4548_062 v1.0

29

μs

Core Components
Symbol

Description

Min.

tOUTCHARGE

Charging timeout which covers constant
current and constant voltage

Typ.

*Table 14: Electrical specification*

1

Validated through simulation.

#### 6.2.12 Electrical characteristics

The following graphs show typical electrical characteristics for CHARGER.

*Figure 9: CHARGER RON vs. junction temperature*

4548_062 v1.0

30

Max.
7

Unit
h

Core Components

*Figure 10: VTERM vs. junction temperature*

*Figure 11: VBUS disconnection (50 mA load on VSYS, VBUS input current limited to 500 mA)*

Core Components

*Figure 12: VBUS connection (50 mA load on VSYS, VBUS input current limited to 100 mA)*

#### 6.2.13 Registers

Instances
Instance

Base address

Description

BCHARGER

0x00000300

CHARGER registers
BCHARGER register map

Register overview
Register

Offset

Description

TASKRELEASEERR

0x0

Release charger from error

TASKCLEARCHGERR

0x1

Clear error registers

TASKCLEARSAFETYTIMER

0x2

Clear safety timers

BCHGENABLESET

0x4

Enable charger

BCHGENABLECLR

0x5

Disable charger

BCHGDISABLESET

0x6

Disable automatic recharge and battery temperature monitoring

BCHGDISABLECLR

0x7

Enable automatic recharge and battery temperature monitoring

BCHGISET

0x8

Configure charge current

BCHGVTERM

0xC

Configure termination voltage for cool and nominal temperature region

BCHGVTERMR

0xD

Configure termination voltage for warm temperature region

BCHGVTRICKLESEL

0xE

Select trickle charge voltage threshold

BCHGITERMSEL

0xF

Select terminaton current

NTCCOLD

0x10

NTC thermistor threshold for cold temperature region

Core Components
Register

Offset

Description

NTCCOLDLSB

0x11

NTC thermistor threshold for cold temperature region

NTCCOOL

0x12

NTC thermistor threshold for cool temperature region

NTCCOOLLSB

0x13

NTC thermistor threshold for cool temperature region

NTCWARM

0x14

NTC thermistor threshold for warm temperature region

NTCWARMLSB

0x15

NTC thermistor threshold for warm temperature region

NTCHOT

0x16

NTC thermistor threshold for hot temperature region

NTCHOTLSB

0x17

NTC thermistor threshold for hot temperature region

DIETEMPSTOP

0x18

Die temperature threshold to stop charging

DIETEMPSTOPLSB

0x19

Die temperature threshold to stop charging

DIETEMPRESUME

0x1A

Die temperature threshold to resume charging

DIETEMPRESUMELSB

0x1B

Die temperature threshold to resume charging

BCHGILIMSTATUS

0x2D

Battery discharge current limit status

NTCSTATUS

0x32

Battery temperature region status

DIETEMPSTATUS

0x33

Die temperature status

BCHGCHARGESTATUS

0x34

Charging status

BCHGERRREASON

0x36

Charge error. Latched error reasons. Cleared with TASKSCLEARCHGERR

BCHGERRSENSOR

0x37

Charger error. Latched conditions. Cleared with TASKSCLEARCHGERR

BCHGCONFIG

0x3C

Charger configuration

BCHGVBATLOWCHARGE

0x50

Enable charging at low battery voltage

##### 6.2.13.1 TASKRELEASEERR

Address offset: 0x0
Release charger from error
Bit number

7

ID

6 5 4 3 2 1 0
A

Reset 0x00
ID

R/W Field

A

W

Value ID

Value

NOEFFECT

0

No effect

TRIGGER

1

Trigger task

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

Description

TASKRELEASEERROR

Release charger from error

##### 6.2.13.2 TASKCLEARCHGERR

Address offset: 0x1
Clear error registers
Bit number
ID

A

Reset 0x00

0

ID

R/W Field

A

W

Value ID

Value

Description

NOEFFECT

0

No effect

TRIGGER

1

Trigger task

TASKCLEARCHGERR

Clear registers BCHGERRREASON and BCHGERRSENSOR

##### 6.2.13.3 TASKCLEARSAFETYTIMER

Address offset: 0x2
Clear safety timers

4548_062 v1.0

33

0 0 0 0 0 0 0

Core Components
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

ID

A

Reset 0x00
ID

R/W Field

A

W

Value ID

Value

Description

TASKCLEARSAFETYTIMER

Clear trickle and charge safety timers

NOEFFECT

0

No effect

TRIGGER

1

Trigger task

##### 6.2.13.4 BCHGENABLESET

Address offset: 0x4
Enable charger
Bit number
ID

B A

Reset 0x00
ID

R/W Field

A

RW

Value ID

Value

Description

ENABLECHARGING

Enable charger. (Read 0: Charging disabled). (Read 1: Charging enabled).

W1S

B

RW

NOEFFECT

0

No effect

ENABLECHG

1

Enable battery charging

ENABLEFULLCHGCOOL

Enable charging of cool battery with full current. (Read 0: 50% charge

W1S

current value of BCHGISET register). (Read 1: 100% charge current value of
BCHGISET register).
NOEFFECT

0

No effect

ENABLECOOL

1

Enable charging of cool battery

##### 6.2.13.5 BCHGENABLECLR

Address offset: 0x5
Disable charger
Bit number

7

6 5 4 3 2 1 0

ID

B A

Reset 0x00

0

ID

R/W Field

A

RW

Value ID

Value

0 0 0 0 0 0 0

Description

ENABLECHARGING

Disable charger. (Read 0: Charging disabled). (Read 1: Charging enabled).

W1C

B

RW

NOEFFECT

0

No effect

DISABLECHG

1

Disable battery charging

ENABLEFULLCHGCOOL

Disable charging of cool battery with full current. (Read 0: 50% charge

W1C

current value of BCHGISET register). (Read 1: 100% charge current value of
BCHGISET register).
NOEFFECT

0

No effect

DISABLECOOL

1

Disable charging of cool battery

##### 6.2.13.6 BCHGDISABLESET

Address offset: 0x6
Disable automatic recharge and battery temperature monitoring

Core Components
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

ID

B A

Reset 0x00
ID

R/W Field

A

RW

Value ID

Value

Description

DISABLERECHARGE

Disable automatic recharge. (Read 0: Recharge enabled). (Read 1: Recharge

W1S

B

RW

disabled).
NOEFFECT

0

No effect

DISABLERCHG

1

Disable recharging of battery once charged

DISABLENTC

Disable battery temperature monitoring. (Read 0: battery temperature

W1S

monitoring enabled) (Read 1: battery temperature monitoring disabled)
NOEFFECT

0

No effect

IGNORENTC

1

Disable battery temperature monitoring

##### 6.2.13.7 BCHGDISABLECLR

Address offset: 0x7
Enable automatic recharge and battery temperature monitoring
Bit number

7

6 5 4 3 2 1 0

ID

B A

Reset 0x00

0

ID

R/W Field

A

RW

Value ID

Value

DISABLERECHARGE

Enable automatic recharge. (Read 0: Recharge enabled). (Read 1: Recharge

W1C

B

RW

0 0 0 0 0 0 0

Description
disabled).

NOEFFECT

0

No effect

ENABLERCHG

1

Enable recharging of battery once charged

DISABLENTC

Enable battery temperature monitoring. (Read 0: battery temperature

W1C

monitoring enabled) (Read 1: battery temperature monitoring disabled)
NOEFFECT

0

No effect

USENTC

1

Enable battery temperature monitoring

##### 6.2.13.8 BCHGISET

Address offset: 0x8
Configure charge current
Bit number

7

ID

A A A A A A A A

Reset 0x08

0

ID

R/W Field

A

RW

Value ID

Value

6 5 4 3 2 1 0

0 0 0 1 0 0 0

Description

BCHGISETCHARGE

Charge current. Default 4 mA. See chapter Charge current limit.

##### 6.2.13.9 BCHGVTERM

Address offset: 0xC
Configure termination voltage for cool and nominal temperature region
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 1 0

ID

A A A A

Reset 0x02
ID

R/W Field

A

RW

Value ID

Value

Description

BCHGVTERMNORM

4548_062 v1.0

Configure termination voltage for cool and nominal temperature region.

Core Components
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 1 0

7

6 5 4 3 2 1 0

ID

A A A A

Reset 0x02
ID

R/W Field

Value ID

Value

Description

3V60

0

3.60 V

3V65

1

3.65 V

4V0

2

4.0 V (default)

4V05

3

4.05 V

4V10

4

4.10 V

4V15

5

4.15 V

4V20

6

4.20 V

4V25

7

4.25 V

4V30

8

4.30 V

4V35

9

4.35 V

4V40

10

4.40 V

4V45

11

4.45 V

4V50

12

4.50 V

4V55

13

4.55 V

4V60

14

4.60 V

4V65

15

4.65 V

##### 6.2.13.10 BCHGVTERMR

Address offset: 0xD
Configure termination voltage for warm temperature region
Bit number
ID

A A A A

Reset 0x02

0

ID

R/W Field

A

RW

Value ID

Value

BCHGVTERMREDUCED

Configure termination voltage for warm temperature region.

3V60

0

3.60 V

3V65

1

3.65 V

4V0

2

4.0 V (default)

4V05

3

4.05 V

4V10

4

4.10 V

4V15

5

4.15 V

4V20

6

4.20 V

4V25

7

4.25 V

4V30

8

4.30 V

4V35

9

4.35 V

4V40

10

4.40 V

4V45

11

4.45 V

4V50

12

4.50 V

4V55

13

4.55 V

4V60

14

4.60 V

4V65

15

4.65 V

##### 6.2.13.11 BCHGVTRICKLESEL

Address offset: 0xE
Select trickle charge voltage threshold

4548_062 v1.0

0 0 0 0 0 1 0

Description

Core Components
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

Bit number

7

6 5 4 3 2 1 0

ID

A A A A A A A A

Reset 0xBB

1

0 1 1 1 0 1 1

7

6 5 4 3 2 1 0

ID

A

Reset 0x00
ID

R/W Field

A

RW

Value ID

Value

Description

2V9

0

2.9 V (default)

2V5

1

2.5 V

BCHGVTRICKLESEL

Select trickle charge voltage threshold

##### 6.2.13.12 BCHGITERMSEL

Address offset: 0xF
Select terminaton current
Bit number
ID

A

Reset 0x00
ID

R/W Field

A

RW

Value ID

Value

Description

SEL10

0

10% (default)

SEL5

1

5%

BCHGITERMSEL

Select terminaton current

##### 6.2.13.13 NTCCOLD

Address offset: 0x10
NTC thermistor threshold for cold temperature region

ID

R/W Field

A

RW

Value ID

Value

Description

NTCCOLDLVLMSB

NTC cold level MSB

##### 6.2.13.14 NTCCOLDLSB

Address offset: 0x11
NTC thermistor threshold for cold temperature region
Bit number
ID

A A

Reset 0x01

0

ID

R/W Field

A

RW

Value ID

Value

Description

NTCCOLDLVLLSB

NTC cold level LSB

##### 6.2.13.15 NTCCOOL

Address offset: 0x12
NTC thermistor threshold for cool temperature region

4548_062 v1.0

37

0 0 0 0 0 0 1

Core Components
Bit number

7

ID

A A A A A A A A

Reset 0xA4

1

0 1 0 0 1 0 0

7

6 5 4 3 2 1 0

ID

R/W Field

A

RW

Value ID

Value

6 5 4 3 2 1 0

Description

NTCCOOLLVLMSB

NTC cool level MSB

##### 6.2.13.16 NTCCOOLLSB

Address offset: 0x13
NTC thermistor threshold for cool temperature region
Bit number
ID

A A

Reset 0x02

0

0 0 0 0 0 1 0

Bit number

7

6 5 4 3 2 1 0

ID

A A A A A A A A

Reset 0x54

0

1 0 1 0 1 0 0

7

6 5 4 3 2 1 0

ID

R/W Field

A

RW

Value ID

Value

Description

NTCCOOLLVLLSB

NTC cool level LSB

##### 6.2.13.17 NTCWARM

Address offset: 0x14
NTC thermistor threshold for warm temperature region

ID

R/W Field

A

RW

Value ID

Value

Description

NTCWARMLVLMSB

NTC warm level MSB

##### 6.2.13.18 NTCWARMLSB

Address offset: 0x15
NTC thermistor threshold for warm temperature region
Bit number
ID

A A

Reset 0x01

0

0 0 0 0 0 0 1

Bit number

7

6 5 4 3 2 1 0

ID

A A A A A A A A

Reset 0x3B

0

ID

R/W Field

A

RW

Value ID

Value

Description

NTCWARMLVLLSB

NTC warm level LSB

##### 6.2.13.19 NTCHOT

Address offset: 0x16
NTC thermistor threshold for hot temperature region

ID

R/W Field

A

RW

Value ID

Value

Description

NTCHOTLVLMSB

4548_062 v1.0

NTC hot level MSB

38

0 1 1 1 0 1 1

Core Components

##### 6.2.13.20 NTCHOTLSB

Address offset: 0x17
NTC thermistor threshold for hot temperature region
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 1

Bit number

7

6 5 4 3 2 1 0

ID

A A A A A A A A

ID

A A

Reset 0x01
ID

R/W Field

A

RW

Value ID

Value

Description

NTCHOTLVLLSB

NTC hot level LSB

##### 6.2.13.21 DIETEMPSTOP

Address offset: 0x18
Die temperature threshold to stop charging

Reset 0x5A

0

1 0 1 1 0 1 0

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

Bit number

7

6 5 4 3 2 1 0

ID

A A A A A A A A

ID

R/W Field

A

RW

Value ID

Value

Description

DIETEMPSTOPCHG

Die temperature stop charging level

##### 6.2.13.22 DIETEMPSTOPLSB

Address offset: 0x19
Die temperature threshold to stop charging
Bit number
ID

A A

Reset 0x00
ID

R/W Field

A

RW

Value ID

Value

Description

DIETEMPSTOPCHGLSB

Die temperature stop charging level LSB

##### 6.2.13.23 DIETEMPRESUME

Address offset: 0x1A
Die temperature threshold to resume charging

Reset 0x5D

0

ID

R/W Field

A

RW

Value ID

Value

Description

DIETEMPRESUMECHG

Die temperature resume charging level

##### 6.2.13.24 DIETEMPRESUMELSB

Address offset: 0x1B
Die temperature threshold to resume charging

4548_062 v1.0

39

1 0 1 1 1 0 1

Core Components
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

ID

A A

Reset 0x00
ID

R/W Field

A

RW

Value ID

Value

Description

DIETEMPRESUMECHGLSB

Die temperature resume charging level LSB

##### 6.2.13.25 BCHGILIMSTATUS

Address offset: 0x2D
Battery discharge current limit status
Bit number
ID

A

Reset 0x00
ID

R/W Field

A

R

Value ID

Value

INACTIVE

0

Battery current limiter not active

ACTIVE

1

Battery current limiter active

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

Description

BCHGILIMBATACTIVE

Discharge current limiter active

##### 6.2.13.26 NTCSTATUS

Address offset: 0x32
Battery temperature region status
Bit number
ID

D C B A

Reset 0x00
ID

R/W Field

Value ID

Value

A

R

NTCCOLD

Cold

B

R

NTCCOOL

Cool

C

R

NTCWARM

Warm

D

R

NTCHOT

Hot

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

Description

##### 6.2.13.27 DIETEMPSTATUS

Address offset: 0x33
Die temperature status
Bit number
ID

A

Reset 0x00
ID

R/W Field

A

R

Value ID

Value

Description

NORMAL

0

Die temperature below DIETEMPSTOP

HIGH

1

Die temperature above DIETEMPSTOP

DIETEMPHIGH

Die temperature status

##### 6.2.13.28 BCHGCHARGESTATUS

Address offset: 0x34
Charging status

Core Components
Bit number

7

ID

H G F E D C B A

Reset 0x00

0

ID

R/W Field

A

R

BATTERYDETECTED

Value ID

Value

Reserved (battery is connected)

B

R

COMPLETED

Charging completed (battery full)

C

R

TRICKLECHARGE

Trickle charge

D

R

CONSTANTCURRENT

Constant current charging

E

R

CONSTANTVOLTAGE

Constant voltage charging

F

R

RECHARGE

Battery re-charge is needed

G

R

DIETEMPHIGHCHGPAUSED

Charging stopped due to die temperature high

H

R

SUPPLEMENTACTIVE

Supplement mode active

6 5 4 3 2 1 0

0 0 0 0 0 0 0

Description

##### 6.2.13.29 BCHGERRREASON

Address offset: 0x36
Charge error. Latched error reasons. Cleared with TASKSCLEARCHGERR
Bit number

7

ID

6 5 4 3 2 1 0
G F E D C B A

Reset 0x00

0

0 0 0 0 0 0 0

Bit number

7

6 5 4 3 2 1 0

ID

H G F E D C B A

ID

R/W Field

Value ID

Value

Description

A

R

NTCSENSORERROR

NTC sensor error

B

R

VBATSENSORERROR

Vbat sensor error

C

R

VBATLOW

VbatLow error

D

R

VTRICKLE

Vtrickle error

E

R

MEASTIMEOUT

Measurement timer timeout

F

R

CHARGETIMEOUT

Charge timer timeout

G

R

TRICKLETIMEOUT

Trickle timer timeout

##### 6.2.13.30 BCHGERRSENSOR

Address offset: 0x37
Charger error. Latched conditions. Cleared with TASKSCLEARCHGERR

Reset 0x00

0

ID

R/W Field

Value ID

Value

Description

A

R

SENSORNTCCOLD

NTC cold region active when error occurs

B

R

SENSORNTCCOOL

NTC cool region active when error occurs

C

R

SENSORNTCWARM

NTC warm region active when error occurs

D

R

SENSORNTCHOT

NTC hot region active when error occurs

E

R

SENSORVTERM

Vterm status when error occurs

F

R

SENSORRECHARGE

Recharge status when error occurs

G

R

SENSORVTRICKLE

Vtrickle status when error occurs

H

R

SENSORVBATLOW

Vbatlow status when error occurs

##### 6.2.13.31 BCHGCONFIG

Address offset: 0x3C
Charger configuration

4548_062 v1.0

41

0 0 0 0 0 0 0

Core Components
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

ID

A

Reset 0x00
ID

R/W Field

A

RW

Value ID

Value

Description

DISABLECHARGEWARM

Disable charging if battery is warm

ENABLED

0

Enable charging if battery is warm

DISABLED

1

Disable charging if battery is warm

##### 6.2.13.32 BCHGVBATLOWCHARGE

Address offset: 0x50
Enable charging at low battery voltage
Bit number
ID

A

Reset 0x00
ID

R/W Field

A

RW

Value ID

Value

Description

ENABLEVBATLOWCHARGE

Enable charging when low battery is below VBATLOW

Disable

0

Disable

Enable

1

Enable

### 6.3 BUCK — Buck regulators

BUCK consists of two step-down buck regulators, BUCK1 and BUCK2.
BUCK has the following features:
• •
• •

Ultra-high efficiency (low IQ) and low noise operation
PWM and Hysteretic modes with automatic switching based on load
TWI configurable for forcing PWM mode to minimize output voltage ripple
Configurable output voltages between 1.0 V and 3.3 V

Hysteretic mode offers efficiency at lower load currents and typically operates up to half the maximum
PWM current. PWM mode provides a clean supply operation due to a constant switching frequency, FBUCK.
This provides optimal coexistence with RF circuits. BUCK can automatically change between Hysteretic and
PWM modes.
Note: The outputs of BUCK1 and BUCK2 must not be tied together as they are not intended to
operate in such configuration.

#### 6.3.1 On/Off control

BUCK is enabled in the following ways.
• VSET[n] pin
• Control registers
• GPIO[n] pin

The VSET1 and VSET2 pins are enabled only at power-on. If resistor RVSETn is present, BUCK is enabled
with the output voltage defined by the resistor value. If the pin is grounded, BUCK is disabled. See Default
VOUT1 using an external resistor on page 43 and Default VOUT2 using an external resistor on page
43.

Core Components
Control registers BUCK1ENASET on page 59, BUCK1ENACLR on page 59, BUCK2ENASET on page
59, and BUCK2ENACLR on page 59 have enable and disable bits for each BUCK. These registers
override the default BUCK state.
A GPIO can be configured in register BUCKENCTRL on page 64 to enable or disable BUCK.
If BUCK is disabled during power up, the system defaults to software control of BUCK.

#### 6.3.2 Output voltage selection

The output voltage range for BUCK is programmable with TWI. The default output voltage selection is
found on pins VSET1 and VSET2, which are configured using an external resistor to GND. Only the
output voltages shown in the tables can be selected using resistors. The VOUT[n] pins have two voltage
configuration registers that are selectable through a GPIO pin with predefined voltage settings available.
The VSET[n] pins are effective only at start up. The external resistor (maximum 5% tolerance) defines
the default output voltage setting as found in the following table.
Symbol
RVSET1

Nominal resistance

VOUT1 start up output voltage

<100 Ω (grounded)

0 V (OFF)

4.7 kΩ

1.0 V

10 kΩ

1.2 V

22 kΩ

1.5 V

47 kΩ

1.8 V

68 kΩ

2.0 V

100 kΩ

2.2 V

150 kΩ

2.5 V

250...500 kΩ

2.7 V

*Table 15: Default VOUT1 using an external resistor*

Symbol
RVSET2

Nominal resistance

VOUT2 start up output voltage

<100 Ω (grounded)

0 V (OFF)

4.7 kΩ

1.8 V

10 kΩ

2.0 V

22 kΩ

2.2 V

47 kΩ

2.4 V

68 kΩ

2.5 V

100 kΩ

2.7 V

150 kΩ

3.0 V

250...500 kΩ

3.3 V

*Table 16: Default VOUT2 using an external resistor*

Core Components
Note: Do not leave VSET[n] floating, make sure that the VSET[n] pins have the correct
configuration.
The output voltage range is from 1.0 V to 3.3 V in 100 mV steps and is set in the voltage configuration
registers BUCK1NORMVOUT on page 61 and BUCK2NORMVOUT on page 62. Once the voltage is
selected, register BUCKSWCTRLSEL on page 66 must be written to for the values to take effect.
Registers BUCK1VOUTSTATUS on page 66 and BUCK2VOUTSTATUS on page 66 indicate the status or
current voltage setting.
A GPIO can be configured to select between two voltage levels. The output voltage for retention mode is
configured in registers BUCK1RETVOUT on page 61 and BUCK2RETVOUT on page 63. Select a GPIO
to control retention voltage in register BUCKVRETCTRL on page 64.

#### 6.3.3 BUCK mode selection

BUCK operates in Automatic mode by default. When in Automatic mode, BUCK selects Hysteretic mode for
low load currents, and PWM mode for high load currents.
In PWM mode, BUCK provides a clean supply operation due to constant switching frequency and lower
voltage ripple for optimal coexistence with RF circuits.
Forced pulse width modulation (PWM) is set by the following:
• Control register bits in BUCK[n]PWMSET
• GPIO[n] pins in register BUCKPWMCTRL on page 65 overriding the register setting for one or
both BUCKs
Hysteretic mode can be forced in register BUCKCTRL0 on page 66 for each BUCK. This setting is not
available using GPIO.

#### 6.3.4 Active output capacitor discharge

When the converter is disabled, active discharge can be enabled or disabled in register BUCKCTRL0 on
page 66 using RDISCH from the output capacitors. The default setting is disabled.
Capacitor discharge is forced when there is a power cycle reset. See figure Power cycle on page 112.

#### 6.3.5 Component selection

Recommended values for the inductor are shown in the following table.
Parameter

Value

Unit

Nominal inductance

2.2

μH

Inductor tolerance

≤ 20

%

DC resistance (DCR)

≤ 400

mΩ

Saturation current (Isat)

> 350

mA

Rated current (Imax)

> 200

mA

*Table 17: Recommended inductor specifications*

Core Components
Parameter

Value

Unit

Effective capacitance

≥4

μF

ESR

≤ 50

mΩ

*Table 18: Recommended capacitor specifications*

#### 6.3.6 Electrical specification

Symbol

Description

Min.

Typ.

VOUT[n]ACC

Output voltage accuracy

VSYSMIN

Minimum VSYS voltage for enabling BUCK
(dependent on POF setting)

IOUT

Maximum BUCK current to maintain
performance

VDROP_OUT

Drop-out voltage 1 mA load

100

mV

RDISCH

Active output capacitor discharge
resistance

2

kΩ

IPWMTHRES

Load current threshold from Hysteretic to
PWM mode (mode = AUTO)

90

mA

IHYSTTHRES

Load current threshold from PWM to
Hysteretic mode (mode = AUTO)

40

mA

5

mVpp

VOUTRIPPLEHYST VOUT ripple in Hysteretic mode

50

mVpp

EFFBUCK

93

%

-5

VOUTRIPPLEPWM VOUT ripple in PWM mode

Max.

Unit

+5

%

2.7

V
200

mA

IOUT = 200 mA

Efficiency in PWM mode
VSYS = 3.8 V
VOUT = 3.3 V
IOUT = 200 mA

fBUCK

Switching frequency in PWM mode

3.6

MHz

tSTRT

Start-up time

1.2

ms

Transition time

90

μs

Hysteretic to PWM mode

(55)

VOUT = 3.3 V
C = 10 µF
tPWMMODE

Automatic (and via TWI or GPIO)

Core Components
Symbol

Description

Min.

Typ.

tHYST

Transition time

35

Hysteretic to PWM mode

(25)

Max.

Automatic (and through TWI or GPIO)

*Table 19: BUCK electrical specification*

#### 6.3.7 Electrical characteristics

The following graphs show typical electrical characteristics for BUCK.

*Figure 13: VBAT = 4.35 V: VOUT = 3.0 V vs. junction temperature*

4548_062 v1.0

46

Unit
μs

Core Components

*Figure 14: VBAT = 3.8: VOUT = 3.0 V vs. junction temperature*

*Figure 15: VBAT = 4.35 V: VOUT = 1.8 vs. junction temperature*

Core Components

*Figure 16: VBAT = 3.8 V: VOUT = 1.8 vs. junction temperature*

*Figure 17: VBAT = 3.8 V: VOUT = 2.0 V: PFM frequency vs. current*

Core Components

*Figure 18: VBAT = 3.8 V: VOUT = 2.0 V: GPIO BUCK start*

*Figure 19: VBAT = 3.8 V: VOUT = 2.0 V: GPIO PWM mode selection*

Core Components

*Figure 20: VBAT = 3.8 V: VOUT = 2.0 V: GPIO PFM mode selection*

*Figure 21: VBAT = 3.8 V: VOUT = 2.0 V: Auto mode extreme load transient*

Core Components

*Figure 22: VBAT = 3.8 V: VOUT = 2.0 V: PWM mode extreme load transient*

*Figure 23: VBAT = 3.8 V: VOUT = 2.0 V: VBUS detach*

Core Components

*Figure 24: VOUT = 1.0 V: PWM Efficiency*

*Figure 25: VOUT = 1.8 V: PWM efficiency*

Core Components

*Figure 26: VOUT = 2.1 V: PWM efficiency*

*Figure 27: VOUT = 3.3 V: PWM efficiency*

Core Components

*Figure 28: VOUT = 1.0 V: Hysteretic efficiency*

*Figure 29: VOUT = 1.8 V: Hysteretic efficiency*

Core Components

*Figure 30: VOUT = 2.1 V: Hysteretic efficiency*

*Figure 31: VOUT = 3.3 V: Hysteretic efficiency*

Core Components

*Figure 32: VOUT = 1.8 V: FFT 10 mA: PFM*

*Figure 33: VOUT = 1.8 V: FFT 50 mA: PFM*

Core Components

*Figure 34: VOUT = 1.8 V: FFT 100 mA: PWM: clock = 3.6 MHz*

*Figure 35: VOUT = 1.8 V: FFT 200 mA: PWM: clock = 3.6 MHz*

Core Components

*Figure 36: BUCK dropout*

#### 6.3.8 Registers

Instances
Instance

Base address

Description

BUCK

0x00000400

BUCK registers
BUCK register

Register overview
Register

Offset

Description

BUCK1ENASET

0x0

Enable BUCK1

BUCK1ENACLR

0x1

Disable BUCK1

BUCK2ENASET

0x2

Enable BUCK2

BUCK2ENACLR

0x3

Disable BUCK2

BUCK1PWMSET

0x4

Enable PWM mode for BUCK1

BUCK1PWMCLR

0x5

Disable PWM mode for BUCK1

BUCK2PWMSET

0x6

Enable PWM mode for BUCK2

BUCK2PWMCLR

0x7

Disable PWM mode for BUCK2

BUCK1NORMVOUT

0x8

Configure BUCK1 output voltage normal mode

BUCK1RETVOUT

0x9

Configure BUCK1 output voltage retention mode

BUCK2NORMVOUT

0xA

Configure BUCK2 output voltage normal mode

BUCK2RETVOUT

0xB

Configure BUCK2 output voltage retention mode

BUCKENCTRL

0xC

Select GPIOs for BUCK1 and BUCK2 enabling

BUCKVRETCTRL

0xD

Select GPIOs for controlling BUCK1 and BUCK2 retention voltage selection

BUCKPWMCTRL

0xE

Select GPIOs for PWM mode controlling BUCK1 and BUCK2

BUCKSWCTRLSEL

0xF

BUCK output voltage set by pin or register

BUCK1VOUTSTATUS

0x10

BUCK1 output voltage target

BUCK2VOUTSTATUS

0x11

BUCK2 output voltage target

Core Components
Register

Offset

Description

BUCKCTRL0

0x15

BUCK auto mode and pull down control

BUCKSTATUS

0x34

BUCK status register

##### 6.3.8.1 BUCK1ENASET

Address offset: 0x0
Enable BUCK1
Bit number

7

ID

6 5 4 3 2 1 0
A

Reset 0x00
ID

R/W Field

A

W

Value ID

Value

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

Description

TASKBUCK1ENASET

Enable BUCK1
NOEFFECT

0

No effect

SET

1

Enable

##### 6.3.8.2 BUCK1ENACLR

Address offset: 0x1
Disable BUCK1
Bit number
ID

A

Reset 0x00
ID

R/W Field

A

W

Value ID

Value

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

Description

TASKBUCK1ENACLR

Disable BUCK1
NOEFFECT

0

No effect

SET

1

Disable

##### 6.3.8.3 BUCK2ENASET

Address offset: 0x2
Enable BUCK2
Bit number
ID

A

Reset 0x00

0

ID

R/W Field

A

W

Value ID

Value

Description

TASKBUCK2ENASET

Enable BUCK2
NOEFFECT

0

No effect

SET

1

Enable

##### 6.3.8.4 BUCK2ENACLR

Address offset: 0x3
Disable BUCK2

4548_062 v1.0

59

0 0 0 0 0 0 0

Core Components
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

ID

A

Reset 0x00
ID

R/W Field

A

W

Value ID

Value

Description

NOEFFECT

0

No effect

SET

1

Disable

TASKBUCK2ENACLR

Disable BUCK2

##### 6.3.8.5 BUCK1PWMSET

Address offset: 0x4
Enable PWM mode for BUCK1
Bit number
ID

A

Reset 0x00
ID

R/W Field

A

W

Value ID

Value

Description

NOEFFECT

0

No effect

SET

1

Enable

TASKBUCK1PWMSET

Enable PWM mode for BUCK1

##### 6.3.8.6 BUCK1PWMCLR

Address offset: 0x5
Disable PWM mode for BUCK1
Bit number
ID

A

Reset 0x00
ID

R/W Field

A

W

Value ID

Value

Description

NOEFFECT

0

No effect

SET

1

Disable

TASKBUCK1PWMCLR

Disable PWM mode for BUCK1 and return to auto mode

##### 6.3.8.7 BUCK2PWMSET

Address offset: 0x6
Enable PWM mode for BUCK2
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

ID

A

Reset 0x00
ID

R/W Field

A

W

Value ID

Value

Description

NOEFFECT

0

No effect

SET

1

Enable

TASKBUCK2PWMSET

Enable PWM mode for BUCK2

##### 6.3.8.8 BUCK2PWMCLR

Address offset: 0x7
Disable PWM mode for BUCK2

Core Components
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

ID

A

Reset 0x00
ID

R/W Field

A

W

Value ID

Value

Description

NOEFFECT

0

No effect

SET

1

Disable

TASKBUCK2PWMCLR

Disable PWM mode for BUCK2 and return to auto mode

##### 6.3.8.9 BUCK1NORMVOUT

Address offset: 0x8
Configure BUCK1 output voltage normal mode
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 1 0

ID

A A A A A

Reset 0x02
ID

R/W Field

A

RW

Value ID

Value

Description

1V

0

1.0 V

1V1

1

1.1 V

1V2

2

1.2 V (default)

1V3

3

1.3 V

1V4

4

1.4 V

1V5

5

1.5 V

1V6

6

1.6 V

1V7

7

1.7 V

1V8

8

1.8 V

1V9

9

1.9 V

2V0

10

2.0 V

2V1

11

2.1 V

2V2

12

2.2 V

2V3

13

2.3 V

2V4

14

2.4 V

2V5

15

2.5 V

2V6

16

2.6 V

2V7

17

2.7 V

2V8

18

2.8 V

2V9

19

2.9 V

3V0

20

3.0 V

3V1

21

3.1 V

3V2

22

3.2 V

3V3

23

3.3 V

3V30

24

3.3 V

BUCK1NORMVOUT

Configure BUCK1 output voltage normal mode

##### 6.3.8.10 BUCK1RETVOUT

Address offset: 0x9
Configure BUCK1 output voltage retention mode

Core Components
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 1 0

7

6 5 4 3 2 1 0

0

0 0 0 1 0 0 0

ID

A A A A A

Reset 0x02
ID

R/W Field

A

RW

Value ID

Value

Description

1V

0

1.0 V

1V1

1

1.1 V

1V2

2

1.2 V (default)

1V3

3

1.3 V

1V4

4

1.4 V

1V5

5

1.5 V

1V6

6

1.6 V

1V7

7

1.7 V

1V8

8

1.8 V

1V9

9

1.9 V

2V0

10

2.0 V

2V1

11

2.1 V

2V2

12

2.2 V

2V3

13

2.3 V

2V4

14

2.4 V

2V5

15

2.5 V

2V6

16

2.6 V

2V7

17

2.7 V

2V8

18

2.8 V

2V9

19

2.9 V

3V0

20

3.0 V

3V1

21

3.1 V

3V2

22

3.2 V

3V3

23

3.3 V

3V30

24

3.3 V

BUCK1RETVOUT

Configure BUCK1 output voltage retention mode

##### 6.3.8.11 BUCK2NORMVOUT

Address offset: 0xA
Configure BUCK2 output voltage normal mode
Bit number
ID

A A A A A

Reset 0x08
ID

R/W Field

A

RW

Value ID

Value

Description

1V

0

1.0 V

1V1

1

1.1 V

1V2

2

1.2 V

1V3

3

1.3 V

1V4

4

1.4 V

1V5

5

1.5 V

1V6

6

1.6 V

1V7

7

1.7 V

1V8

8

1.8 V (default)

1V9

9

1.9 V

2V0

10

2.0 V

2V1

11

2.1 V

BUCK2NORMVOUT

4548_062 v1.0

Configure BUCK2 output voltage normal mode

Core Components
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 1 0 0 0

7

6 5 4 3 2 1 0

ID

A A A A A

Reset 0x08
ID

R/W Field

Value ID

Value

Description

2V2

12

2.2 V

2V3

13

2.3 V

2V4

14

2.4 V

2V5

15

2.5 V

2V6

16

2.6 V

2V7

17

2.7 V

2V8

18

2.8 V

2V9

19

2.9 V

3V0

20

3.0 V

3V1

21

3.1 V

3V2

22

3.2 V

3V3

23

3.3 V

3V30

24

3.3 V

##### 6.3.8.12 BUCK2RETVOUT

Address offset: 0xB
Configure BUCK2 output voltage retention mode
Bit number
ID

A A A A A

Reset 0x08

0

ID

R/W Field

A

RW

Value ID

Value

Description

1V

0

1.0 V

1V1

1

1.1 V

1V2

2

1.2 V

1V3

3

1.3 V

1V4

4

1.4 V

1V5

5

1.5 V

1V6

6

1.6 V

1V7

7

1.7 V

1V8

8

1.8 V (default)

1V9

9

1.9 V

2V0

10

2.0 V

2V1

11

2.1 V

2V2

12

2.2 V

2V3

13

2.3 V

2V4

14

2.4 V

2V5

15

2.5 V

2V6

16

2.6 V

2V7

17

2.7 V

2V8

18

2.8 V

2V9

19

2.9 V

3V0

20

3.0 V

3V1

21

3.1 V

3V2

22

3.2 V

3V3

23

3.3 V

3V30

24

3.3 V

BUCK2RETVOUT

4548_062 v1.0

Configure BUCK2 output voltage retention mode

63

0 0 0 1 0 0 0

Core Components

##### 6.3.8.13 BUCKENCTRL

Address offset: 0xC
Select GPIOs for BUCK1 and BUCK2 enabling
Bit number

7

ID

D C B B B A A A

Reset 0x00

0

0 0 0 0 0 0 0

Bit number

7

6 5 4 3 2 1 0

ID

D C B B B A A A

Reset 0x00

0

ID

R/W Field

A

RW

B

C

D

RW

RW

RW

Value ID

Value

NOTUSED

0

Not used

GPIO0

1

GPIO 0 selected

GPIO1

2

GPIO 1 selected

GPIO2

3

GPIO 2 selected

GPIO3

4

GPIO 3 selected

GPIO4

5

GPIO 4 selected

NOTUSED1

6

No GPIO selected

NOTUSED2

7

No GPIO selected

6 5 4 3 2 1 0

Description

BUCK1ENGPISEL

Select which GPIO controls BUCK1 enable

BUCK2ENGPISEL

Select which GPIO controls BUCK2 enable
NOTUSED1

0

Not used

GPIO0

1

GPIO 0 selected

GPIO1

2

GPIO 1 selected

GPIO2

3

GPIO 2 selected

GPIO3

4

GPIO 3 selected

GPIO4

5

GPIO 4 selected

NOTUSED3

6

No GPIO selected

NOTUSED4

7

No GPIO selected

NORMAL

0

Not inverted

INVERTED

1

Inverted

BUCK1ENGPIINV

Invert the sense of the selected GPIO for BUCK1

BUCK2ENGPIINV

Invert the sense of the selected GPIO for BUCK2
NORMAL

0

Not inverted

INVERTED

1

Inverted

##### 6.3.8.14 BUCKVRETCTRL

Address offset: 0xD
Select GPIOs for controlling BUCK1 and BUCK2 retention voltage selection

ID

R/W Field

A

RW

B

RW

Value ID

Value

Description

NOTUSED

0

Not used

GPIO0

1

GPIO 0 selected

GPIO1

2

GPIO 1 selected

GPIO2

3

GPIO 2 selected

GPIO3

4

GPIO 3 selected

GPIO4

5

GPIO 4 selected

NOTUSED2

6

Not used

NOTUSED1

7

Not used

BUCK1VRETGPISEL

Select which GPIO controls BUCK1 retention voltage

BUCK2VRETGPISEL

4548_062 v1.0

Select which GPIO controls BUCK2 retention voltage

64

0 0 0 0 0 0 0

Core Components
Bit number

7

ID

D C B B B A A A

Reset 0x00

0

0 0 0 0 0 0 0

Bit number

7

6 5 4 3 2 1 0

ID

D C B B B A A A

ID

C

D

R/W Field

RW

RW

Value ID

Value

Description

NOTUSED

0

Not used

GPIO0

1

GPIO 0 selected

GPIO1

2

GPIO 1 selected

GPIO2

3

GPIO 2 selected

GPIO3

4

GPIO 3 selected

GPIO4

5

GPIO 4 selected

NOTUSED2

6

Not used

NOTUSED1

7

Not used

NORMAL

0

Not inverted

INVERTED

1

Inverted

NORMAL

0

Not inverted

INVERTED

1

Inverted

BUCK1VRETGPIINV

6 5 4 3 2 1 0

Invert the sense of the selected GPIO for BUCK1

BUCK2VRETGPIINV

Invert the sense of the selected GPIO for BUCK2

##### 6.3.8.15 BUCKPWMCTRL

Address offset: 0xE
Select GPIOs for PWM mode controlling BUCK1 and BUCK2

Reset 0x00

0

ID

R/W Field

A

RW

B

C

D

RW

RW

RW

Value ID

Value

Description

NOTUSED1

0

Not used

GPIO0

1

GPIO 0 selected

GPIO1

2

GPIO 1 selected

GPIO2

3

GPIO 2 selected

GPIO3

4

GPIO 3 selected

GPIO4

5

GPIO 4 selected

NOTUSED

6

Not used

NOTUSED2

7

Not used

NOTUSED1

0

Not used

GPIO0

1

GPIO 0 selected

GPIO1

2

GPIO 1 selected

GPIO2

3

GPIO 2 selected

GPIO3

4

GPIO 3 selected

GPIO4

5

GPIO 4 selected

NOTUSED

6

Not used

NOTUSED2

7

Not used

BUCK1PWMGPISEL

Select which GPIO controls BUCK1 force PWM

BUCK2PWMGPISEL

Select which GPIO controls BUCK2 force PWM

BUCK1PWMGPIINV

Invert the sense of the selected GPIO for BUCK1
NORMAL

0

Not inverted

INVERTED

1

Inverted

NORMAL

0

Not inverted

INVERTED

1

Inverted

BUCK2PWMGPIINV

4548_062 v1.0

Invert the sense of the selected GPIO for BUCK2

65

0 0 0 0 0 0 0

Core Components

##### 6.3.8.16 BUCKSWCTRLSEL

Address offset: 0xF
BUCK output voltage set by pin or register
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

ID

B A

Reset 0x00
ID

R/W Field

A

RW

B

RW

Value ID

Value

Description

VSETANDSWCTRL

0

VSET pin controls output voltage

SWCTRL

1

Register controls output voltage

VSETANDSWCTRL

0

VSET pin controls output voltage

SWCTRL

1

Register controls output voltage

BUCK1SWCTRLSEL

Output voltage control for BUCK1

BUCK2SWCTRLSEL

Output voltage control for BUCK2

##### 6.3.8.17 BUCK1VOUTSTATUS

Address offset: 0x10
BUCK1 output voltage target
Bit number
ID

A A A A A

Reset 0x00
ID

R/W Field

A

R

Value ID

Value

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

Description

BUCK1VOUTSTATUS

Selected VOUT target

##### 6.3.8.18 BUCK2VOUTSTATUS

Address offset: 0x11
BUCK2 output voltage target
Bit number
ID

A A A A A

Reset 0x00
ID

R/W Field

A

R

Value ID

Value

Description

BUCK2VOUTSTATUS

Selected VOUT target

##### 6.3.8.19 BUCKCTRL0

Address offset: 0x15
BUCK auto mode and pull down control
Bit number
ID

D C B A

Reset 0x00

0

ID

R/W Field

A

RW

B

RW

Value ID

Value

Description

AUTO

0

Select auto switching between PFM and PWM

PFM

1

Select PFM mode only

BUCK1AUTOCTRLSEL

BUCK1 control

BUCK2AUTOCTRLSEL

4548_062 v1.0

BUCK2 control

66

0 0 0 0 0 0 0

Core Components
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

Bit number

7

6 5 4 3 2 1 0

ID

F

E D D C B A A

0

0 0 0 0 0 0 0

ID

D C B A

Reset 0x00
ID

C

D

R/W Field

RW

RW

Value ID

Value

Description

AUTO

0

Select auto switching between PFM and PWM

PFM

1

Select PFM mode only

LOW

0

BUCK1 pull down disabled

HIGH

1

BUCK1 pull down enabled

BUCK1ENPULLDOWN

BUCK1 pull down

BUCK2ENPULLDOWN

BUCK2 pull down
LOW

0

BUCK2 pull down disabled

HIGH

1

BUCK2 pull down enabled

##### 6.3.8.20 BUCKSTATUS

Address offset: 0x34
BUCK status register

Reset 0x00
ID

R/W Field

A

R

B

C

D

E

F

R

R

R

R

R

Value ID

Value

Description

BUCK1MODE

BUCK1 mode
AUTOMODE

0

Auto mode

PFMMODE

1

PFM mode

PWMMODE

2

Force PWM mode

RFU

3

Reserved (PWM mode)

BUCKDISABLED

0

BUCK powered off

BUCKPOWERED

1

BUCK powered on

BUCK1PWRGOOD

BUCK1 status

BUCK1PWMOK

BUCK1 PWM status
PWMMODEDISABLED0

PWM mode disabled

PWMMODEENABLED1

PWM mode enabled

BUCK2MODE

BUCK2 mode
AUTOMODE

0

Auto mode

PFMMODE

1

PFM mode

PWMMODE

2

Force PWM mode

RFU

3

Reserved (PWM mode)

BUCK2PWRGOOD

BUCK2 status
BUCKDISABLED

0

BUCK powered off

BUCKPOWERED

1

BUCK powered on

BUCK2PWMOK

BUCK2 PWM status
PWMMODEDISABLED0

PWM mode disabled

PWMMODEENABLED1

PWM mode enabled

### 6.4 LOADSW/LDO — Load switches/LDO regulators

Two load switches are available for use as switches or LDO regulators (LDO). They have dedicated input
pins where voltage cannot exceed VSYS. The input voltage can be equal to VOUT1, VOUT2, or any voltage
up to the VSYS voltage.
The load switches (and LDOs) are OFF by default and can be controlled through control registers or GPIO
pins using the following bits.

Core Components
• Control register bits for each load switch or LDO:
• TASK.LDSW[n]SET
• TASK.LDSW[n]CLR
• GPIO[n], once configured by host software:
• LDSW[n]GPISEL
When a GPIO is used to control LOADSW/LDO, it uses edges. When the GPIO toggles from LOW to HIGH,
LOADSW/LDO turns ON (switch conducting). When the GPIO toggles from HIGH to LOW, LOADSW/LDO
turns OFF.
Each load switch or LDO can be assigned to a separate GPIO, or a single GPIO can control both switches or
LDOs.
A pull-down resistor RLSPD on the LSOUT[n] pin is enabled in a register bit for LOADSW/LDO. See register
LDSW.LDSWCONFIG.

Load switch mode
Load switch mode is selected using registers LDSW[n]LDOSEL.
Soft start is enabled by default. This ensures that the current to LSOUT[n] is limited for tSS. Once soft
start is complete, there will be no current limiting provided by the load switch. Current limiting is only
available from the power source connected to LSIN[n].
The soft start current limit for a load switch can be set in register LDSW.LDSWCONFIG.
Note: Valid for Build code B00 and later: the respective LDO[n]SOFTSTARTENABLE bit in
VBUSIN.LDOSOFTSTARTCFG has to be set to 0 when using LOADSW/LDO as a load switch.

LDO mode
This information is valid for Build code A00:
The load switches can be independently configured as LDOs using LDSW[n]LDOSEL. The LDO output
voltage is configurable in registers LDSW[n]VOUTSEL.
The LDO can be supplied from VOUT1, VOUT2 or VSYS, but must comply with VINLDO.
The LDOs do not support soft start.

LDO mode
This information is valid for Build code B00 and later:
The load switches can be independently configured as LDOs. The LDO output voltage is configurable in
registers LDSW[n]VOUTSEL.
The LDO can be supplied from VOUT1, VOUT2 or VSYS, but must comply with VINLDO.
The LDO should always be used with soft start enabled. This can be configured via register settings:
• Keep LDSW[n]LDOSEL: LDSW[n]SEL = 0
• Configure the LOADSW/LDO as an LDO by setting VBUSIN.LDOSOFTSTARTCFG:
LDO[n]SOFTSTARTENABLE = 1
• Configure soft start current limit in register LDSW.LDSWCONFIG

#### 6.4.1 Electrical specification

Core Components
Symbol

Description

Min.

RDSONLS

Switch on-resistance

Typ.

Max.

200

Unit
mΩ

LSIN = 3.3 V
ILS

100

Current

mA

LSOUT ≥ 1.2 V
tSS

Soft start time

1.8

ms

2

kΩ

Soft start current limit = 25 mA, 10 µF, 0 V
to 5 V
RLSPD

Pull-down resistor (active discharge) at
LSOUT

VINLS

Input voltage range

IQLS

Additional quiescent current from VBAT
when load switch is enabled (VBAT = 3.8 V,
VINLS = VSYS, ILOAD = 0, VBUS disconnected,
both BUCKs running in Hysteretic mode)

1.0

*Table 20: LOADSW electrical specification*

4548_062 v1.0

69

VSYS
60

V
nA

Core Components
Symbol

Description

IOUTLDO

Output current VOUT > 1.2 V

50

mA

IOUTLDO

Output current VOUT < 1.2 V

10

mA

VINLDO

Input voltage range

VSYS

V

VOUTLDO

Minimum setting output voltage

1.0

V

VOUTLDO

Maximum setting output voltage

3.3

V

VOUTLDO_STEP

Output voltage step size

100

mV

VOUTACC

DC output voltage accuracy
(VINLDO = 3.8 V to 5.5 V, ILOAD = 1 mA)

±3

%

LINEREG_LDO

DC line regulation
(VOUTLDO = 1.0 V, VINLDO = 3 V to 5.5 V,
ILOAD = 1 mA)

2

mV/V

DC line regulation
(VOUTLDO = 1.8 V, VINLDO = 3 V to 5.5 V,
ILOAD = 1 mA)

4

mV/V

DC line regulation
(VOUTLDO = 3.3 V, VINLDO = 3.7 V to 5.5 V,
ILOAD = 1 mA)

11

mV/V

DC load regulation
(VOUTLDO = 1 V to 1.2 V, VINLDO = 3.8 V,
ILOAD = 50 μA to 10 mA)

0.4

mV/mA

DC load regulation
(VOUTLDO = 1.8 V to 3.3 V, VINLDO = 3.8 V,
ILOAD = 50 μA to 50 mA)

0.25

mV/mA

PSRR

Power supply rejection ratio
(VOUTLDO = 3 V, VINLDO = 3.8 V, ILOAD = 20
mA, f = 1 kHz)

50

dB

VRIPPLE

Output voltage ripple in ULP mode
(VBUS disconnected, both BUCKs running
in Hysteretic mode, VOUTLDO = 1.8 V,
VINLDO = 3.8 V, ILOAD = 1 mA)

17

mVp-p

Output voltage ripple in ULP mode
(VBUS disconnected, both BUCKs running
in Hysteretic mode, VOUTLDO = 3.3 V,
VINLDO = 3.8 V, ILOAD = 1 mA)

35

mVp-p

LDODROPOUT

Dropout voltage
VOUTLDO = 3.3 V, ILOAD = 50 mA

25

mV

IQLDO

Additional quiescent current from VBAT
when LDO is enabled (VBAT = 3.8 V, VINLDO
= VSYS, ILOAD = 0, VBUS disconnected, both
BUCKs running in Hysteretic mode)

500

nA

Additional quiescent current from VBAT
when LDO is enabled (VBAT = 3.8 V, VINLDO

10

μA

LOADREG_LDO

4548_062 v1.0

Min.

Typ.

2.6

70

Max.

Unit

Core Components
Symbol

Description

Min.

Typ.

= VSYS, ILOAD = 0, VBUS disconnected, both
BUCKs running in PWM mode)

*Table 21: LDO electrical specification*

#### 6.4.2 Electrical characteristics

The following graphs show typical electrical characteristics for LOADSW.

*Figure 37: LOADSW RDSON vs. junction temperature*

The following graphs show electrical characteristics for LDO.

4548_062 v1.0

71

Max.

Unit

Core Components

*Figure 38: LDO voltage accuracy vs. junction temperature (VBUS = 5.5 V)*

*Figure 39: LDO voltage accuracy vs. junction temperature (VBAT = 3.8 V)*

Core Components

*Figure 40: LDO dropout vs. junction temperature*

*Figure 41: VINLDO = 3.8 V: VOUTLDO = 1.8 V: LDO load transient*

Core Components

*Figure 42: VOUTLDO = 1.8 V or 3.0 V: Leakage current vs. junction temperature (no load)*

#### 6.4.3 Registers

Instances
Instance

Base address

Description

LDSW

0x00000800

LOADSW registers
LDSW register map

Register overview
Register

Offset

Description

TASKLDSW1SET

0x0

Enable LDSW1

TASKLDSW1CLR

0x1

Disable LDSW1

TASKLDSW2SET

0x2

Enable LDSW2

TASKLDSW2CLR

0x3

Disable LDSW2

LDSWSTATUS

0x4

Load switch and LDO status

LDSW1GPISEL

0x5

LDSW1 GPIO control select

LDSW2GPISEL

0x6

LDSW2 GPIO control select

LDSWCONFIG

0x7

Load switch or LDO configuration

LDSW1LDOSEL

0x8

Select LDSW1 mode

LDSW2LDOSEL

0x9

Select LDSW2 mode

LDSW1VOUTSEL

0xC

LDO1 programmable output voltage

LDSW2VOUTSEL

0xD

LDO2 programmable output voltage

##### 6.4.3.1 TASKLDSW1SET

Address offset: 0x0
Enable LDSW1

Core Components
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

ID

A

Reset 0x00
ID

R/W Field

A

W

Value ID

Value

Description

NOEFFECT

0

No effect

SET

1

Set enable

TASKLDSW1SET

Set LDSW1 enable

##### 6.4.3.2 TASKLDSW1CLR

Address offset: 0x1
Disable LDSW1
Bit number
ID

A

Reset 0x00
ID

R/W Field

A

W

Value ID

Value

Description

NOEFFECT

0

No effect

CLR

1

Clear enable

TASKLDSW1CLR

Clear LDSW1 enable

##### 6.4.3.3 TASKLDSW2SET

Address offset: 0x2
Enable LDSW2
Bit number
ID

A

Reset 0x00
ID

R/W Field

A

W

Value ID

Value

Description

NOEFFECT

0

No effect

SET

1

Set enable

TASKLDSW2SET

Set LDSW2 enable

##### 6.4.3.4 TASKLDSW2CLR

Address offset: 0x3
Disable LDSW2
Bit number
ID

A

Reset 0x00
ID

R/W Field

A

W

Value ID

Value

Description

NOEFFECT

0

No effect

CLR

1

Clear enable

TASKLDSW2CLR

Clear LDSW2 enable

##### 6.4.3.5 LDSWSTATUS

Address offset: 0x4
Load switch and LDO status

Core Components
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

ID

E D C B A

Reset 0x00
ID

R/W Field

A

R

B

C

D

E

R

R

R

R

Value ID

Value

Description

OFF

0

OFF

ON

1

ON

OFF

0

OFF

ON

1

ON

OFF

0

OFF

ON

1

ON

LDSW1PWRUPLDSW

Load switch 1 status

LDSW1PWRUPLDO

LDO1 status

LDSW2PWRUPLDSW

Load switch 2 status

LDSW2PWRUPLDO

LDO2 status
OFF

0

OFF

ON

1

ON

OFF

0

OFF

ON

1

ON

LDSWENABLE

LDSW1 or LDSW2 in use

##### 6.4.3.6 LDSW1GPISEL

Address offset: 0x5
LDSW1 GPIO control select
Bit number
ID

B A A A

Reset 0x00
ID

R/W Field

A

RW

B

RW

Value ID

Value

Description

NOTUSED1

0

No GPIO selected

GPIO0

1

GPIO 0 selected

GPIO1

2

GPIO 1 selected

GPIO2

3

GPIO 2 selected

GPIO3

4

GPIO 3 selected

GPIO4

5

GPIO 4 selected

NOTUSED2

6

No GPIO selected

NOTUSED3

7

No GPIO selected

LDSW1GPISEL

Select which GPIO controls LDSW1

LDSW1GPIINV

Invert the sense of the selected GPIO
NORMAL

0

Not inverted

INVERTED

1

Inverted

##### 6.4.3.7 LDSW2GPISEL

Address offset: 0x6
LDSW2 GPIO control select
Bit number
ID

B A A A

Reset 0x00

0

ID

R/W Field

A

RW

Value ID

Value

Description

LDSW2GPISEL

Select which GPIO controls LDSW2
NOTUSED1

4548_062 v1.0

0

No GPIO selected

76

0 0 0 0 0 0 0

Core Components
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

Bit number

7

6 5 4 3 2 1 0

ID

F

E D D C C B A

Reset 0x00

0

0 0 0 0 0 0 0

ID

B A A A

Reset 0x00
ID

B

R/W Field

RW

Value ID

Value

Description

GPIO0

1

GPIO 0 selected

GPIO1

2

GPIO 1 selected

GPIO2

3

GPIO 2 selected

GPIO3

4

GPIO 3 selected

GPIO4

5

GPIO 4 selected

NOTUSED2

6

No GPIO selected

NOTUSED3

7

No GPIO selected

NORMAL

0

Not inverted

INVERTED

1

Inverted

LDSW2GPIINV

Invert the sense of the selected GPIO

##### 6.4.3.8 LDSWCONFIG

Address offset: 0x7
Load switch or LDO configuration

ID

R/W Field

A

RW

B

C

D

E

F

RW

RW

RW

RW

RW

Value ID

Value

Description

LDSW1SOFTSTARTDISABLE

LDSW1 soft start disable

NOEFFECT

0

No effect

NOSOFTSTART

1

Soft start disabled

LDSW2SOFTSTARTDISABLE

LDSW2 soft start disable

NOEFFECT

0

No effect

NOSOFTSTART

1

Soft start disabled

LDSW1SOFTSTARTSEL

Select soft start level for LDSW1

25MA

0

25 mA

50MA

1

50 mA

75MA

2

75 mA

100MA

3

100 mA

LDSW2SOFTSTARTSEL

Select soft start level for LDSW2

25MA

0

25 mA

50MA

1

50 mA

75MA

2

75 mA

100MA

3

100 mA

LDSW1ACTIVEDISCHARGE

LDSW1 active discharge enable

NODISCHARGE

0

No discharge

ACTIVE

1

Active discharge enabled

LDSW2ACTIVEDISCHARGE

LDSW2 active discharge enable

NODISCHARGE

0

No discharge

ACTIVE

1

Active discharge enabled

##### 6.4.3.9 LDSW1LDOSEL

Address offset: 0x8
Select LDSW1 mode

Core Components
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

ID

A

Reset 0x00
ID

R/W Field

A

RW

Value ID

Value

Description

LDSW1LDOSEL

Select Load switch or LDO. For Build code B00 and later keep this register =
0x0 for both Load switch and LDO modes.
LDSW

0

Load switch

LDO

1

LDO

##### 6.4.3.10 LDSW2LDOSEL

Address offset: 0x9
Select LDSW2 mode
Bit number

7

ID

6 5 4 3 2 1 0
A

Reset 0x00

0

ID

R/W Field

A

RW

Value ID

Value

0 0 0 0 0 0 0

Description

LDSW2LDOSEL

Select Load switch or LDO. For Build code B00 and later keep this register =
0x0 for both Load switch and LDO modes.
LDSW

0

Load switch

LDO

1

LDO

##### 6.4.3.11 LDSW1VOUTSEL

Address offset: 0xC
LDO1 programmable output voltage
Bit number

7

ID

6 5 4 3 2 1 0
A A A A A

Reset 0x00

0

ID

R/W Field

A

RW

Value ID

Value

Description

1V

0

1.0 V

1V1

1

1.1 V

1V2

2

1.2 V

1V3

3

1.3 V

1V4

4

1.4 V

1V5

5

1.5 V

1V6

6

1.6 V

1V7

7

1.7 V

1V8

8

1.8 V

1V9

9

1.9 V

2V

10

2.0 V

2V1

11

2.1 V

2V2

12

2.2 V

2V3

13

2.3 V

2V4

14

2.4 V

2V5

15

2.5 V

2V6

16

2.6 V

2V7

17

2.7 V

2V8

18

2.8 V

2V9

19

2.9 V

LDSW1VOUTSEL

4548_062 v1.0

LDO1 programmable output voltage

78

0 0 0 0 0 0 0

Core Components
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

ID

A A A A A

Reset 0x00
ID

R/W Field

Value ID

Value

Description

3V

20

3.0 V

3V1

21

3.1 V

3V2

22

3.2 V

3V3

23

3.3 V

##### 6.4.3.12 LDSW2VOUTSEL

Address offset: 0xD
LDO2 programmable output voltage
Bit number
ID

A A A A A

Reset 0x00

0

ID

R/W Field

A

RW

Value ID

Value

Description

LDSW2VOUTSEL

LDO2 programmable output voltage
1V

0

1.0 V

1V1

1

1.1 V

1V2

2

1.2 V

1V3

3

1.3 V

1V4

4

1.4 V

1V5

5

1.5 V

1V6

6

1.6 V

1V7

7

1.7 V

1V8

8

1.8 V

1V9

9

1.9 V

2V

10

2.0 V

2V1

11

2.1 V

2V2

12

2.2 V

2V3

13

2.3 V

2V4

14

2.4 V

2V5

15

2.5 V

2V6

16

2.6 V

2V7

17

2.7 V

2V8

18

2.8 V

2V9

19

2.9 V

3V

20

3.0 V

3V1

21

3.1 V

3V2

22

3.2 V

3V3

23

3.3 V

### 6.5 LEDDRV — LED drivers

LEDDRV is made of three identical low-side LED drivers on pins LED0, LED1, and LED2. Pin
configurations are independent of each other.
The pins can be configured in registers for the following purposes:
• Charge indication
• Charge error indication

4548_062 v1.0

79

0 0 0 0 0 0 0

Core Components
• An RGB LED (requires all three pins)
• A general purpose, open-drain output
When a pin is used as a charging indication, the charging state machine controls LEDDRV.
Pins that are used as general purpose LED drivers have a control register containing separate bits for
enabling each driver, see registers LEDDRV0SET on page 81 and LEDDRV0CLR on page 82. The host
software will set or reset the control register bit, which alters the state of the LED associated with that
register bit.
LEDDRV can be used as open-drain digital output. Open Drain mode is the same as the general purpose
LED drivers but with the LED removed. An external pull up resistor is required for each LED pin operating in
Open Drain mode.
The system can control an RGB LED component (or three separate LEDs) . The LED0, LED1, and LED2
pins can connect to any of the RGB LED cathodes (low-side). The anodes (common or individual) must
be connected to the VSYS pin. The R, G, or B value is activated by enabling the associated LED register.
Combinations of RG, RB, GB, and RGB are possible.

#### 6.5.1 Electrical specification

Symbol

Description

Min.

ILED

LED driver current

VLEDn

Voltage on pin LED0, LED1, and LED2

Typ.
5

0.5

*Table 22: LEDDRV electrical specification*

#### 6.5.2 Registers

Instances
Instance

Base address

Description

LEDDRV

0x00000A00

LEDDRV registers
LEDDRV register map

Register overview
Register

Offset

Description

LEDDRV0MODESEL

0x0

Select LED0 mode

LEDDRV1MODESEL

0x1

Select LED1 mode

LEDDRV2MODESEL

0x2

Select LED2 mode

LEDDRV0SET

0x3

Turn LED0 On

LEDDRV0CLR

0x4

Turn LED0 Off

LEDDRV1SET

0x5

Turn LED1 On

LEDDRV1CLR

0x6

Turn LED1 Off

LEDDRV2SET

0x7

Turn LED2 On

LEDDRV2CLR

0x8

Turn LED2 Off

##### 6.5.2.1 LEDDRV0MODESEL

Address offset: 0x0

4548_062 v1.0

Max.

80

Unit
mA

VSYS

V

Core Components
Select LED0 mode
Bit number

7

ID

6 5 4 3 2 1 0
A A

Reset 0x00
ID

R/W Field

A

RW

Value ID

Value

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 1

7

6 5 4 3 2 1 0

Description

LEDDRV0MODESEL

Select LED0 mode
ERROR

0

Error condition from charger

CHARGING

1

Charging indicator (On during charging)

HOST

2

Driven from register LEDDRV0SET/CLR

NOTUSED

3

Not used

##### 6.5.2.2 LEDDRV1MODESEL

Address offset: 0x1
Select LED1 mode
Bit number
ID

A A

Reset 0x01
ID

R/W Field

A

RW

Value ID

Value

Description

ERROR

0

Error condition from charger

CHARGING

1

Charging indicator (On during charging)

HOST

2

Driven from register LEDDRV1SET/CLR

NOTUSED

3

Not used

LEDDRV1MODESEL

Select LED1 mode

##### 6.5.2.3 LEDDRV2MODESEL

Address offset: 0x2
Select LED2 mode
Bit number
ID

A A

Reset 0x02

0

ID

R/W Field

A

RW

Value ID

Value

Description

LEDDRV2MODESEL

Select LED2 mode
ERROR

0

Error condition from charger

CHARGING

1

Charging indicator (On during charging)

HOST

2

Driven from register LEDDRV2SET/CLR

NOTUSED

3

Not used

##### 6.5.2.4 LEDDRV0SET

Address offset: 0x3
Turn LED0 On

4548_062 v1.0

81

0 0 0 0 0 1 0

Core Components
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

ID

A

Reset 0x00
ID

R/W Field

A

W

Value ID

Value

Description

NOEFFECT

0

No effect

SET

1

Turns On LED0 if LEDDRVMODESEL = HOST

LEDDRV0ON

Set LED0 to be On

##### 6.5.2.5 LEDDRV0CLR

Address offset: 0x4
Turn LED0 Off
Bit number
ID

A

Reset 0x00
ID

R/W Field

A

W

Value ID

Value

Description

NOEFFECT

0

No effect

CLR

1

Turns Off LED0 if LEDDRVMODESEL = HOST

LEDDRV0OFF

Set LED0 to be Off

##### 6.5.2.6 LEDDRV1SET

Address offset: 0x5
Turn LED1 On
Bit number
ID

A

Reset 0x00
ID

R/W Field

A

W

Value ID

Value

Description

NOEFFECT

0

No effect

SET

1

Turns On LED1 if LEDDRVMODESEL = HOST

LEDDRV1ON

Set LED1 to be On

##### 6.5.2.7 LEDDRV1CLR

Address offset: 0x6
Turn LED1 Off
Bit number
ID

A

Reset 0x00
ID

R/W Field

A

W

Value ID

Value

Description

NOEFFECT

0

No effect

CLR

1

Turns Off LED1 if LEDDRVMODESEL = HOST

LEDDRV1OFF

Set LED1 to be Off

##### 6.5.2.8 LEDDRV2SET

Address offset: 0x7
Turn LED2 On

Core Components
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

ID

A

Reset 0x00
ID

R/W Field

A

W

Value ID

Value

Description

NOEFFECT

0

No effect

SET

1

Turns On LED2 if LEDDRVMODESEL = HOST

LEDDRV2ON

Set LED2 to be On

##### 6.5.2.9 LEDDRV2CLR

Address offset: 0x8
Turn LED2 Off
Bit number
ID

A

Reset 0x00
ID

R/W Field

A

W

Value ID

Value

Description

NOEFFECT

0

No effect

CLR

1

Turns Off LED2 if LEDDRVMODESEL = HOST

LEDDRV2OFF

Set LED2 to be Off

### 6.6 GPIO — General purpose input/output

By default, the general purpose input/output pins, GPIO[n], are set as input with weak pull-down. GPIO
is supplied by the VDDIO pin.
The number of GPIOs varies with product variant and package. See Pin assignments on page 150 for
more information about the number of supported GPIOs.
GPIO has the following configurable features:
• •
• •
• General purpose input
Control input
Output
BUCK control
LOADSW control
Note: Events may occur when GPIO configuration is changed on the fly.

Pull-down is prioritized if both pull-up and pull-down are activated on a GPIO pin at the same time.
The following figure shows BUCK control.

Core Components

GPIO4
GPIO3
GPIO2
GPIO1

ENABLE

To other IPs:
BUCK2
LOADSW1
LOADSW2

BUCK1

BUCKENCTRL.BUCK1ENGPISEL

FORCEDPWM

GPIO4
GPIO3
GPIO2
GPIO1

GPIO0_IN_EN

GPIOMODE

BUCKPWMCTRL.BUCK1PWMGPISEL
POF
NRESETOUT
GenPurpOUT
Interrupt

GPIO0

GPIO0_OUT_EN

*Figure 43: GPIO concept*

Pins LED0, LED1, and LED2 can be used as open-drain outputs, see LEDDRV — LED drivers on page
79.

#### 6.6.1 Pin configuration

The GPIO peripheral implements up to 5 pins, GPIO[0...4]. Each of these pins can be individually
configured in the GPIOMODE[n] registers.

General purpose input
GPIO can be used as a general purpose input to monitor the input logic level. Debounce is set in register
GPIO.DEBOUNCE[n]. Set GPI.INPUT to use GPIO[n] without setting an event.
It can also be used as an input to trigger an event. Set bit GPI.RISING.EVENT to generate an event on the
rising edge. To generate an event on a falling edge, set bit GPI.FALLING.EVENT. The events are visible in the
register EVENTSGPIOSET on page 141.
To override GPIO input states, set bit GPI.LOGIC[n].

Control input
For a pin to function as a control input, write 0 in bit GPI.INPUT. Debounce is set in register
GPIO.DEBOUNCE[n]. The following components can be controlled through GPIO once enabled in the
corresponding register.
• •
• •

LOADSW – Registers LDSW1GPISEL on page 76 or LDSW2GPISEL on page 76
BUCK – Register BUCKENCTRL on page 64
BUCK forced PWM mode – Register BUCKPWMCTRL on page 65
BUCK VOUT[n] voltage level selection for active and retention modes – Register BUCKVRETCTRL on
page 64
• Second reset button – GPIO0 only, see Two-button reset on page 120

Output
The GPIO outputs can be configured as logic outputs or open drain outputs in register
GPIO.OPEN.DRAIN[n].

Core Components
When setting a GPIO as output, the host software disables any pull-up or pull-down on that GPIO. After a
reset, the default is for pull-down to be enabled.
GPIO can be used as a general purpose output by setting bit GPO.LOGIC[n].
GPIO can be used as an interrupt by setting one or more from the following registers:
• •
• •
• INTENEVENTSADCSET on page 125
INTEN.EVENTS.BCHARGER[n]SET
INTENEVENTSSHPHLDSET on page 135
INTEN.EVENTS.VBUSIN[n]SET
INTENEVENTSGPIOSET on page 143

GPIO can indicate a watchdog event when the watchdog expires. Select bit GPO.RESET to enable watchdog
events.
An imminent power failure warning can be set by selecting bit GPO.PLW.
Drive strength can be selected in register GPIODRIVE[0] on page 88. Weak pull-up and pull-down
resistors are available in the following registers:
• GPIO.PDEN[n]
• GPIO.PUEN[n]

#### 6.6.2 Electrical specification

Symbol

Description

Min.

Typ.

Max.

VIH

Input high voltage

0.7 x VDDIO

VDDIO

V

VIL

Input low voltage

AVSS

0.3 x VDDIO

V

PUGPIO

Weak pull-up resistor

500

kΩ

PDGPIO

Weak pull-down resistor

500

kΩ

DBGPIO

Input debounce time
(DEBOUNCE1=1)

20

ms

*Table 23: GPIO electrical specification*

#### 6.6.3 Registers

Instances
Instance

Base address

Description

GPIOS

0x00000600

GPIO Registers
GPIOS register map

Register overview
Register

Offset

Description

GPIOMODE[0]

0x0

GPIO mode configuration

GPIOMODE[1]

0x1

GPIO mode configuration

GPIOMODE[2]

0x2

GPIO mode configuration

GPIOMODE[3]

0x3

GPIO mode configuration

4548_062 v1.0

85

Unit

Core Components
Register

Offset

Description

GPIOMODE[4]

0x4

GPIO mode configuration

GPIODRIVE[0]

0x5

GPIO drive strength configuration

GPIODRIVE[1]

0x6

GPIO drive strength configuration

GPIODRIVE[2]

0x7

GPIO drive strength configuration

GPIODRIVE[3]

0x8

GPIO drive strength configuration

GPIODRIVE[4]

0x9

GPIO drive strength configuration

GPIOPUEN[0]

0xA

GPIO pull up enable configuration

GPIOPUEN[1]

0xB

GPIO pull up enable configuration

GPIOPUEN[2]

0xC

GPIO pull up enable configuration

GPIOPUEN[3]

0xD

GPIO pull up enable configuration

GPIOPUEN[4]

0xE

GPIO pull up enable configuration

GPIOPDEN[0]

0xF

GPIO pull down enable configuration

GPIOPDEN[1]

0x10

GPIO pull down enable configuration

GPIOPDEN[2]

0x11

GPIO pull down enable configuration

GPIOPDEN[3]

0x12

GPIO pull down enable configuration

GPIOPDEN[4]

0x13

GPIO pull down enable configuration

GPIOOPENDRAIN[0]

0x14

GPIO open drain configuration

GPIOOPENDRAIN[1]

0x15

GPIO open drain configuration

GPIOOPENDRAIN[2]

0x16

GPIO open drain configuration

GPIOOPENDRAIN[3]

0x17

GPIO open drain configuration

GPIOOPENDRAIN[4]

0x18

GPIO open drain configuration

GPIODEBOUNCE[0]

0x19

GPIO debounce configuration

GPIODEBOUNCE[1]

0x1A

GPIO debounce configuration

GPIODEBOUNCE[2]

0x1B

GPIO debounce configuration

GPIODEBOUNCE[3]

0x1C

GPIO debounce configuration

GPIODEBOUNCE[4]

0x1D

GPIO debounce configuration

GPIOSTATUS

0x1E

GPIO status

##### 6.6.3.1 GPIOMODE[0]

Address offset: 0x0
GPIO mode configuration
Bit number

7

ID

6 5 4 3 2 1 0
A A A A

Reset 0x00

0

ID

R/W Field

A

RW

Value ID

Value

Description

GPIINPUT

0

Input

GPILOGIC1

1

Input, internally driven high

GPILOGIC0

2

Input, internally driven low

GPIEVENTRISE

3

Input, event from rising edge

GPIEVENTFALL

4

Input, event from falling edge

GPOIRQ

5

Interrupt output

GPORESET

6

Reset output

GPOPLW

7

Power failure warning output

GPOLOGIC1

8

Output, pin driven high

GPOLOGIC0

9

Output, pin driven low

GPIOMODE

GPIO mode selection

##### 6.6.3.2 GPIOMODE[1]

Address offset: 0x1
GPIO mode configuration
4548_062 v1.0

86

0 0 0 0 0 0 0

Core Components
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

ID

A A A A

Reset 0x00
ID

R/W Field

A

RW

Value ID

Value

Description

GPIINPUT

0

Input

GPILOGIC1

1

Input, internally driven high

GPILOGIC0

2

Input, internally driven low

GPIEVENTRISE

3

Input, event from rising edge

GPIEVENTFALL

4

Input, event from falling edge

GPOIRQ

5

Interrupt output

GPORESET

6

Reset output

GPOPLW

7

Power failure warning output

GPOLOGIC1

8

Output, pin driven high

GPOLOGIC0

9

Output, pin driven low

GPIOMODE

GPIO mode selection

##### 6.6.3.3 GPIOMODE[2]

Address offset: 0x2
GPIO mode configuration
Bit number
ID

A A A A

Reset 0x00
ID

R/W Field

A

RW

Value ID

Value

Description

GPIINPUT

0

Input

GPILOGIC1

1

Input, internally driven high

GPILOGIC0

2

Input, internally driven low

GPIEVENTRISE

3

Input, event from rising edge

GPIEVENTFALL

4

Input, event from falling edge

GPOIRQ

5

Interrupt output

GPORESET

6

Reset output

GPOPLW

7

Power failure warning output

GPOLOGIC1

8

Output, pin driven high

GPOLOGIC0

9

Output, pin driven low

GPIOMODE

GPIO mode selection

##### 6.6.3.4 GPIOMODE[3]

Address offset: 0x3
GPIO mode configuration
Bit number
ID

A A A A

Reset 0x00
ID

R/W Field

A

RW

Value ID

Value

Description

GPIINPUT

0

Input

GPILOGIC1

1

Input, internally driven high

GPILOGIC0

2

Input, internally driven low

GPIEVENTRISE

3

Input, event from rising edge

GPIEVENTFALL

4

Input, event from falling edge

GPOIRQ

5

Interrupt output

GPIOMODE

4548_062 v1.0

GPIO mode selection

Core Components
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

ID

A A A A

Reset 0x00
ID

R/W Field

Value ID

Value

Description

GPORESET

6

Reset output

GPOPLW

7

Power failure warning output

GPOLOGIC1

8

Output, pin driven high

GPOLOGIC0

9

Output, pin driven low

##### 6.6.3.5 GPIOMODE[4]

Address offset: 0x4
GPIO mode configuration
Bit number
ID

A A A A

Reset 0x00
ID

R/W Field

A

RW

Value ID

Value

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

Description

GPIOMODE

GPIO mode selection
GPIINPUT

0

Input

GPILOGIC1

1

Input, internally driven high

GPILOGIC0

2

Input, internally driven low

GPIEVENTRISE

3

Input, event from rising edge

GPIEVENTFALL

4

Input, event from falling edge

GPOIRQ

5

Interrupt output

GPORESET

6

Reset output

GPOPLW

7

Power failure warning output

GPOLOGIC1

8

Output, pin driven high

GPOLOGIC0

9

Output, pin driven low

##### 6.6.3.6 GPIODRIVE[0]

Address offset: 0x5
GPIO drive strength configuration
Bit number
ID

A

Reset 0x00
ID

R/W Field

A

RW

Value ID

Value

Description

1MA

0

1 mA

6MA

1

6 mA

GPIODRIVE

GPIO drive strength

##### 6.6.3.7 GPIODRIVE[1]

Address offset: 0x6
GPIO drive strength configuration

Core Components
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

ID

A

Reset 0x00
ID

R/W Field

A

RW

Value ID

Value

Description

1MA

0

1 mA

6MA

1

6 mA

GPIODRIVE

GPIO drive strength

##### 6.6.3.8 GPIODRIVE[2]

Address offset: 0x7
GPIO drive strength configuration
Bit number
ID

A

Reset 0x00
ID

R/W Field

A

RW

Value ID

Value

Description

1MA

0

1 mA

6MA

1

6 mA

GPIODRIVE

GPIO drive strength

##### 6.6.3.9 GPIODRIVE[3]

Address offset: 0x8
GPIO drive strength configuration
Bit number
ID

A

Reset 0x00
ID

R/W Field

A

RW

Value ID

Value

Description

1MA

0

1 mA

6MA

1

6 mA

GPIODRIVE

GPIO drive strength

##### 6.6.3.10 GPIODRIVE[4]

Address offset: 0x9
GPIO drive strength configuration
Bit number
ID

A

Reset 0x00
ID

R/W Field

A

RW

Value ID

Value

Description

1MA

0

1 mA

6MA

1

6 mA

GPIODRIVE

GPIO drive strength

##### 6.6.3.11 GPIOPUEN[0]

Address offset: 0xA
GPIO pull up enable configuration

Core Components
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

ID

A

Reset 0x00
ID

R/W Field

A

RW

Value ID

Value

Description

PULLUP0

0

Pull up disable

PULLUP1

1

Pull up enable

GPIOPUEN

GPIO pull up enable

##### 6.6.3.12 GPIOPUEN[1]

Address offset: 0xB
GPIO pull up enable configuration
Bit number
ID

A

Reset 0x00
ID

R/W Field

A

RW

Value ID

Value

Description

PULLUP0

0

Pull up disable

PULLUP1

1

Pull up enable

GPIOPUEN

GPIO pull up enable

##### 6.6.3.13 GPIOPUEN[2]

Address offset: 0xC
GPIO pull up enable configuration
Bit number
ID

A

Reset 0x00
ID

R/W Field

A

RW

Value ID

Value

Description

PULLUP0

0

Pull up disable

PULLUP1

1

Pull up enable

GPIOPUEN

GPIO pull up enable

##### 6.6.3.14 GPIOPUEN[3]

Address offset: 0xD
GPIO pull up enable configuration
Bit number
ID

A

Reset 0x00
ID

R/W Field

A

RW

Value ID

Value

Description

PULLUP0

0

Pull up disable

PULLUP1

1

Pull up enable

GPIOPUEN

GPIO pull up enable

##### 6.6.3.15 GPIOPUEN[4]

Address offset: 0xE
GPIO pull up enable configuration

Core Components
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 1

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 1

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 1

ID

A

Reset 0x00
ID

R/W Field

A

RW

Value ID

Value

Description

PULLUP0

0

Pull up disable

PULLUP1

1

Pull up enable

GPIOPUEN

GPIO pull up enable

##### 6.6.3.16 GPIOPDEN[0]

Address offset: 0xF
GPIO pull down enable configuration
Bit number
ID

A

Reset 0x01
ID

R/W Field

A

RW

Value ID

Value

Description

PULLDOWN0

0

Pull down disable

PULLDOWN1

1

Pull down enable

GPIOPDEN

GPIO pull down enable

##### 6.6.3.17 GPIOPDEN[1]

Address offset: 0x10
GPIO pull down enable configuration
Bit number
ID

A

Reset 0x01
ID

R/W Field

A

RW

Value ID

Value

Description

PULLDOWN0

0

Pull down disable

PULLDOWN1

1

Pull down enable

GPIOPDEN

GPIO pull down enable

##### 6.6.3.18 GPIOPDEN[2]

Address offset: 0x11
GPIO pull down enable configuration
Bit number
ID

A

Reset 0x01
ID

R/W Field

A

RW

Value ID

Value

Description

PULLDOWN0

0

Pull down disable

PULLDOWN1

1

Pull down enable

GPIOPDEN

GPIO pull down enable

##### 6.6.3.19 GPIOPDEN[3]

Address offset: 0x12
GPIO pull down enable configuration

Core Components
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 1

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 1

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

ID

A

Reset 0x01
ID

R/W Field

A

RW

Value ID

Value

Description

PULLDOWN0

0

Pull down disable

PULLDOWN1

1

Pull down enable

GPIOPDEN

GPIO pull down enable

##### 6.6.3.20 GPIOPDEN[4]

Address offset: 0x13
GPIO pull down enable configuration
Bit number
ID

A

Reset 0x01
ID

R/W Field

A

RW

Value ID

Value

Description

PULLDOWN0

0

Pull down disable

PULLDOWN1

1

Pull down enable

GPIOPDEN

GPIO pull down enable

##### 6.6.3.21 GPIOOPENDRAIN[0]

Address offset: 0x14
GPIO open drain configuration
Bit number
ID

A

Reset 0x00
ID

R/W Field

A

RW

Value ID

Value

Description

OPENDRAIN0

0

Open drain disable

OPENDRAIN1

1

Open drain enable

GPIOOPENDRAIN

GPIO open drain

##### 6.6.3.22 GPIOOPENDRAIN[1]

Address offset: 0x15
GPIO open drain configuration
Bit number
ID

A

Reset 0x00
ID

R/W Field

A

RW

Value ID

Value

Description

OPENDRAIN0

0

Open drain disable

OPENDRAIN1

1

Open drain enable

GPIOOPENDRAIN

GPIO open drain

##### 6.6.3.23 GPIOOPENDRAIN[2]

Address offset: 0x16
GPIO open drain configuration

Core Components
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

ID

A

Reset 0x00
ID

R/W Field

A

RW

Value ID

Value

Description

OPENDRAIN0

0

Open drain disable

OPENDRAIN1

1

Open drain enable

GPIOOPENDRAIN

GPIO open drain

##### 6.6.3.24 GPIOOPENDRAIN[3]

Address offset: 0x17
GPIO open drain configuration
Bit number
ID

A

Reset 0x00
ID

R/W Field

A

RW

Value ID

Value

Description

OPENDRAIN0

0

Open drain disable

OPENDRAIN1

1

Open drain enable

GPIOOPENDRAIN

GPIO open drain

##### 6.6.3.25 GPIOOPENDRAIN[4]

Address offset: 0x18
GPIO open drain configuration
Bit number
ID

A

Reset 0x00
ID

R/W Field

A

RW

Value ID

Value

Description

OPENDRAIN0

0

Open drain disable

OPENDRAIN1

1

Open drain enable

GPIOOPENDRAIN

GPIO open drain

##### 6.6.3.26 GPIODEBOUNCE[0]

Address offset: 0x19
GPIO debounce configuration
Bit number
ID

A

Reset 0x00
ID

R/W Field

A

RW

Value ID

Value

Description

DEBOUNCE0

0

Debounce disable

DEBOUNCE1

1

Debounce enable

GPIODEBOUNCE

GPIO debounce

##### 6.6.3.27 GPIODEBOUNCE[1]

Address offset: 0x1A
GPIO debounce configuration

Core Components
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

ID

A

Reset 0x00
ID

R/W Field

A

RW

Value ID

Value

Description

DEBOUNCE0

0

Debounce disable

DEBOUNCE1

1

Debounce enable

GPIODEBOUNCE

GPIO debounce

##### 6.6.3.28 GPIODEBOUNCE[2]

Address offset: 0x1B
GPIO debounce configuration
Bit number
ID

A

Reset 0x00
ID

R/W Field

A

RW

Value ID

Value

Description

DEBOUNCE0

0

Debounce disable

DEBOUNCE1

1

Debounce enable

GPIODEBOUNCE

GPIO debounce

##### 6.6.3.29 GPIODEBOUNCE[3]

Address offset: 0x1C
GPIO debounce configuration
Bit number
ID

A

Reset 0x00
ID

R/W Field

A

RW

Value ID

Value

Description

DEBOUNCE0

0

Debounce disable

DEBOUNCE1

1

Debounce enable

GPIODEBOUNCE

GPIO debounce

##### 6.6.3.30 GPIODEBOUNCE[4]

Address offset: 0x1D
GPIO debounce configuration
Bit number
ID

A

Reset 0x00
ID

R/W Field

A

RW

Value ID

Value

Description

DEBOUNCE0

0

Debounce disable

DEBOUNCE1

1

Debounce enable

GPIODEBOUNCE

GPIO debounce

##### 6.6.3.31 GPIOSTATUS

Address offset: 0x1E
GPIO status

Core Components
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

ID

E D C B A

Reset 0x00
ID

R/W Field

A

R

B

C

D

E

R

R

R

R

Value ID

Value

Description

LOW

0

Low

HIGH

1

High

LOW

0

Low

HIGH

1

High

LOW

0

Low

HIGH

1

High

GPIO0STATUS

GPIO0 status

GPIO1STATUS

GPIO1 status

GPIO2STATUS

GPIO2 status

GPIO3STATUS

GPIO3 status
LOW

0

Low

HIGH

1

High

LOW

0

Low

HIGH

1

High

GPIO4STATUS

4548_062 v1.0

GPIO4 status

## 7 System features

### 7.1 System Monitor

The chip includes a 10-bit ADC which is used for measuring internal parameters. It can be used in the
following measurement modes:
• Single-shot
• Automatic
• Timed

Measurement request priority
When multiple measurement requests happen at the same time, the priority is as follows:
1. VBAT
2. Battery temperature, TBAT
3. Battery current, IBAT
4. Die temperature, TDIE
5. VSYS
6. VBUS
If a measurement has been requested but the measurement has not started, a higher priority can be
requested.
When a low priority measurement is requested and the system has started the measurement, a higher
priority can be requested. The system will complete the lower priority measurement before the higher
priority measurement.

#### 7.1.1 Single-shot measurements

Single-shot measurements are triggered by a task specific for each measurement.
Value

Task

Battery temperature

TASKNTCMEASURE on page 101

Battery voltage, Single-shot mode and
Burst mode

TASKVBATMEASURE on page 101

VSYS voltage

TASKVSYSMEASURE on page 102

Battery current

ADCIBATMEASEN on page 107 (occurs after VBAT
measurement)

VBUS voltage

TASKVBUS7MEASURE on page 102

Die temperature

TASKTEMPMEASURE on page 101

ADCCONFIG on page 103

*Table 24: Tasks for single-shot measurements*

A VBAT measurement triggered in Burst mode performs four consecutive measurements, with each result
available separately. Conversions are run back-to-back and complete in tCONV.

System features
Note: To repeat a measurement, it must be requested once the previous request is complete.
Repeat measurement requests are lost when made while the previous conversion is still ongoing.
Alternate measurements can be requested, which are queued. See System Monitor on page 96
for more information.

#### 7.1.2 Automatic measurements

Automatic measurements for battery voltage are enabled in register ADCCONFIG on page 103. The
default interval is 1024 ms.

##### 7.1.2.1 Automatic measurements during charging

Battery temperature and die temperature are measured automatically at regular intervals when the
battery is charging. The host software can read this value and returns the latest measurement.
The measurement intervals are as follows:
• Battery temperature – once every 64, 128, or 1024 ms.
• Die temperature – once every 4 ms, see Charger thermal regulation on page 26.
Note: To enable automatic thermistor and die temperature monitoring, set register
TASKAUTOTIMUPDATE on page 104. This should also be set after changing the automated
period.

#### 7.1.3 Timed measurements

Timed measurements for battery voltage in Single-shot mode and Burst mode are initiated in register
ADCDELTIMCONF on page 104. See Monitor battery state of charge on page 99 for more
information.

#### 7.1.4 Measurement results

Results from the ADC are stored in registers according to the following table. Some registers hold alternate
results when that feature is requested. Host software must concatenate the LSB to the MSB of the result
register for full accuracy.

System features

Value/alternate result

Register

VBAT

ADCVBATRESULTMSB on page 104

Battery temperature

ADCNTCRESULTMSB on page 105

Die temperature

ADCTEMPRESULTMSB on page 105

VSYS Single-shot mode

ADCVSYSRESULTMSB on page 105

LSBs for Single-shot mode VSYS, Die temperature,
NTC thermistor, and VBAT

ADCGP0RESULTLSBS on page 105

Burst mode VBAT0

ADCVBAT0RESULTMSB on page 105

Burst mode VBAT1

ADCVBAT1RESULTMSB on page 106

Burst mode VBAT2

ADCVBAT2RESULTMSB on page 106

Battery current IBAT
ADCVBAT3RESULTMSB on page 106

Burst mode VBAT3
Single-shot mode VBUS
LSBs for Burst mode VBAT0, VBAT1, VBAT2, VBAT3,
IBAT and VBUS

ADCGP1RESULTLSBS on page 106

*Table 25: ADC measurements*

The following equations can be used to read the results.

VBAT
The equation for VBAT is given by the following:

Here, VBATADC is the ADC value from the VBAT register and VFSVBAT is the full scale voltage for measuring
VBAT.

VBUS
The equation for VBUS is given by the following:

Here, VBUSADC is the ADC value from the VBUS register and VFSVBUS is the full scale voltage for measuring
VBUS.

VSYS
Equation for VSYS is given by the following:

Here, VSYSADC is the ADC value from the VBUS register and VFSVSYS is the full scale voltage for measuring
VBUS.

System features

Battery temperature (Kelvin)
The battery temperature TBAT (in Kelvin) is given by the following equation:

Here, T0 = 298.15 K, TBATADC is the ADC value from the battery temperature register ADCNTCRESULTMSB
and β is the NTC beta parameter.

Die temperature in °C
The die temperature, TD (in °C), is given by the following equation:
Here, KDIETEMP is the ADC value for the die temperature.

#### 7.1.5 Events and interrupts

An event register and interrupt are available for each measurement and are issued once the measurement
has been completed.
See registers EVENTSADCSET on page 123, EVENTSADCCLR on page 124, INTENEVENTSADCSET on
page 125, and INTENEVENTSADCCLR on page 126.

#### 7.1.6 Battery temperature measurement

Before using a battery temperature measurement, the appropriate NTC thermistor must be configured.
See Monitor battery temperature on page 24 for information about suitable thermistors and how to
configure.

#### 7.1.7 Monitor battery state of charge

The host runs the fuel gauge algorithm and periodically requests measurements from the ADC. These
measurements update the algorithm parameters and allow the state of charge to be determined.
The algorithm must be provided with the battery model parameters for accurate fuel gauge readings. The
battery model parameters can be created from the nPM PowerUP application.
Once the battery is modeled over the operating temperature range, the fuel gauge algorithm is optimized
to operate over the full range of battery voltages, temperatures, and application currents.

#### 7.1.8 Battery current measurement

Host software can request a IBAT measurement by setting bit IBAT.MEAS.ENABLE to 1 in register
ADCIBATMEASEN on page 107. This allows consecutive VBAT and IBAT measurements. When both
measurements are available in the ADC registers, the ADCIBATRDY event is generated. See register
ADCIBATMEASSTATUS on page 104 for more information about the IBAT measurement.
Measurements are invalid and a new measurement is needed when bit IBAT.MEASE.INVALID is set.
Direction of current flow is shown in bit BCHARGER.MODE.
A value of 01 means the battery is discharging. During a discharge, the full scale current is 140 mA.
A value of 10 means the system is supplied by VBUS.
A value of 11 means the battery is charging. When charging, the full scale current (in Amps) is the charge
current setting (as configured in register BCHGISET) multiplied by 1.25.

System features

#### 7.1.9 Electrical specification

Symbol

Description

Min.

VFSVBAT

Full scale voltage for VBAT measurement

VBATACCUR

Accuracy of the VBAT measurement

Typ.

Max.

5.0
-1

Unit
V

+1

%

(3 V < VBAT < 4.5 V and -10°C < TJ <
+125°C)
VFSVBUS

Full scale voltage for VBUS measurement

7.5

V

VBUSACCUR

Accuracy of the VBUS measurement

±1.5

%

VFSVSYS

Full scale voltage for VSYS measurement

6.375

V

VSYSACCUR

Accuracy of the VSYS measurement

±1.5

%

CBATNTC

Capacitance in parallel with the thermistor

VFSTEMP

Full scale for battery and die temperature
measurements

1.5

V

tCONV

Conversion time

250

μs

DNL

Differential non-linearity

< 0.5

LSB

0

100

*Table 26: System Monitor electrical specification*

#### 7.1.10 Registers

Instances
Instance

Base address

Description

ADC

0x00000500

SAADC registers
ADC register map

Register overview
Register

Offset

Description

TASKVBATMEASURE

0x0

Battery voltage measurement

TASKNTCMEASURE

0x1

Battery temperature measurement

TASKTEMPMEASURE

0x2

Die temperature measurement

TASKVSYSMEASURE

0x3

VSYS measurement

TASKIBATMEASURE

0x6

Battery current measurement

TASKVBUS7MEASURE

0x7

VBUS measurement

TASKDELAYEDVBATMEASURE

0x8

Delayed battery voltage measurement

ADCCONFIG

0x9

ADC configuration

ADCNTCRSEL

0xA

Select battery NTC thermistor

ADCAUTOTIMCONF

0xB

Auto measurement intervals

TASKAUTOTIMUPDATE

0xC

Strobe for AUTOTIMCONF

ADCDELTIMCONF

0xD

Configure delay for battery voltage measurement

ADCIBATMEASSTATUS

0x10

Battery current measurement status

4548_062 v1.0

100

pF

System features
Register

Offset

Description

ADCVBATRESULTMSB

0x11

Battery voltage measurement result MSB

ADCNTCRESULTMSB

0x12

Battery temperature measurement result MSB

ADCTEMPRESULTMSB

0x13

Die temperature measurement result MSB

ADCVSYSRESULTMSB

0x14

VSYS measurement result MSB

ADCGP0RESULTLSBS

0x15

Result LSBs (VBAT, battery temperature, die temperature and VSYS)

ADCVBAT0RESULTMSB

0x16

VBAT0 burst measurement result MSB

ADCVBAT1RESULTMSB

0x17

VBAT1 burst measurement result MSB

ADCVBAT2RESULTMSB

0x18

VBAT2 burst measurement result MSB

ADCVBAT3RESULTMSB

0x19

VBAT3 burst or VBUS measurement result MSB

ADCGP1RESULTLSBS

0x1A

VBAT burst measurement result LSBs (VBAT0, VBAT1, VBAT2 and VBAT3)

ADCIBATMEASEN

0x24

Enable automatic battery current measurement

##### 7.1.10.1 TASKVBATMEASURE

Address offset: 0x0
Battery voltage measurement
Bit number

7

ID

6 5 4 3 2 1 0
A

Reset 0x00
ID

R/W Field

A

W

Value ID

Value

NOEFFECT

0

No effect

TRIGGER

1

Trigger task

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

Description

TASKVBATMEASURE

Start VBAT measurement

##### 7.1.10.2 TASKNTCMEASURE

Address offset: 0x1
Battery temperature measurement
Bit number
ID

A

Reset 0x00
ID

R/W Field

A

W

Value ID

Value

NOEFFECT

0

No effect

TRIGGER

1

Trigger task

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

Description

TASKNTCMEASURE

Start battery NTC thermistor measurement

##### 7.1.10.3 TASKTEMPMEASURE

Address offset: 0x2
Die temperature measurement
Bit number
ID

A

Reset 0x00

0

ID

R/W Field

A

W

Value ID

Value

Description

NOEFFECT

0

No effect

TRIGGER

1

Trigger task

TASKTEMPMEASURE

4548_062 v1.0

Start die temperature measurement

101

0 0 0 0 0 0 0

System features

##### 7.1.10.4 TASKVSYSMEASURE

Address offset: 0x3
VSYS measurement
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

ID

A

Reset 0x00
ID

R/W Field

A

W

Value ID

Value

Description

NOEFFECT

0

No effect

TRIGGER

1

Trigger task

TASKVSYSMEASURE

Start VSYS measurement

##### 7.1.10.5 TASKIBATMEASURE

Address offset: 0x6
Battery current measurement
Bit number
ID

A

Reset 0x00
ID

R/W Field

A

W

Value ID

Value

Description

NOEFFECT

0

No effect

TRIGGER

1

Trigger task

TASKIBATMEASURE

Start IBAT measurement

##### 7.1.10.6 TASKVBUS7MEASURE

Address offset: 0x7
VBUS measurement
Bit number
ID

A

Reset 0x00
ID

R/W Field

A

W

Value ID

Value

Description

TASKVBUS7MEASURE

Start VBUS measurement

NOEFFECT

0

No effect

TRIGGER

1

Trigger task

##### 7.1.10.7 TASKDELAYEDVBATMEASURE

Address offset: 0x8
Delayed battery voltage measurement
Bit number
ID

A

Reset 0x00
ID

R/W Field

A

W

Value ID

Value

Description

TASKDLYDVBATMEASURE

4548_062 v1.0

Start delayed VBAT measurement

NOEFFECT

0

No effect

TRIGGER

1

Trigger task

System features

##### 7.1.10.8 ADCCONFIG

Address offset: 0x9
ADC configuration
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

ID

B A

Reset 0x00
ID

R/W Field

A

RW

B

RW

Value ID

Value

Description

NOAUTO

0

No automatic measurements

AUTOENABLE

1

Trigger measurement every 1 s

SINGLEMODE

0

Trigger a single measurement

BURSTMODE

1

Trigger 4 consecutive measurements

VBATAUTOENABLE

Enable VBAT Auto measurement every 1 s

VBATBURSTENABLE

Enable VBAT burst mode VBAT0, VBAT1, VBAT2, VBAT3

##### 7.1.10.9 ADCNTCRSEL

Address offset: 0xA
Select battery NTC thermistor
Bit number

7

6 5 4 3 2 1 0

ID

A A

Reset 0x01
ID

R/W Field

A

RW

Value ID

Value

Hi_Z

0

No thermistor

10K

1

NTC 10 kOhm

47K

2

NTC 47 kOhm

100K

3

NTC 100 kOhm

0

0 0 0 0 0 0 1

7

6 5 4 3 2 1 0

0

0 0 0 0 0 1 1

Description

ADCNTCRSEL

Select thermistor value

##### 7.1.10.10 ADCAUTOTIMCONF

Address offset: 0xB
Auto measurement intervals
Bit number
ID

B B A A

Reset 0x03
ID

R/W Field

A

RW

B

RW

Value ID

Value

Description

4MS

0

4 ms

64MS

1

64 ms

128MS

2

128 ms

1024MS

3

1024 ms

NTCAUTOTIM

Battery thermistor measurement interval when charging

TEMPAUTOTIM

4548_062 v1.0

Die temperature measurement interval when charging
4MS

0

4 ms

8MS

1

8 ms

16MS

2

16 ms

32MS

3

32 ms

System features

##### 7.1.10.11 TASKAUTOTIMUPDATE

Address offset: 0xC
Strobe for AUTOTIMCONF
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

ID

A

Reset 0x00
ID

R/W Field

A

W

Value ID

Value

Description

TASKAUTOTIMUPDATE

Update NTCAUTOTIM and TEMPAUTOTIM measurement intervals

NOEFFECT

0

No effect

UPDATEAUTOTIM

1

Update

##### 7.1.10.12 ADCDELTIMCONF

Address offset: 0xD
Configure delay for battery voltage measurement
Bit number

7

ID

A A A A A A A A

Reset 0x00

0

ID

R/W Field

A

RW

Value ID

Value

6 5 4 3 2 1 0

0 0 0 0 0 0 0

Description

VBATDELTIM

Delay from 4 ms (value 0) to 514 ms (value 255) in 2 ms steps

##### 7.1.10.13 ADCIBATMEASSTATUS

Address offset: 0x10
Battery current measurement status
Bit number

7

ID

6 5 4 3 2 1 0
C B B A A

Reset 0x00

0
Value ID

Value

0 0 0 0 0 0 0

ID

R/W Field

Description

A

R

BCHARGERICHARGE

Scaling factor for charging current (00=10%, 01=50%, 11=100%)

B

R

BCHARGERMODE

Battery charger mode (01=discharging, 10=idle, no battery current,

C

R

IBATMEASEINVALID

11=charging)
IBAT measurement invalid

##### 7.1.10.14 ADCVBATRESULTMSB

Address offset: 0x11
Battery voltage measurement result MSB
Bit number

7

ID

A A A A A A A A

Reset 0x00

0

ID

R/W Field

A

R

Value ID

Value

Description

VBATRESULTMSB

4548_062 v1.0

Battery voltage measurement result MSB

104

6 5 4 3 2 1 0

0 0 0 0 0 0 0

System features

##### 7.1.10.15 ADCNTCRESULTMSB

Address offset: 0x12
Battery temperature measurement result MSB
Bit number

7

ID

A A A A A A A A

Reset 0x00

0

0 0 0 0 0 0 0

Bit number

7

6 5 4 3 2 1 0

ID

A A A A A A A A

ID

R/W Field

A

R

Value ID

Value

6 5 4 3 2 1 0

Description

NTCRESULTMSB

Battery temperature measurement result MSB

##### 7.1.10.16 ADCTEMPRESULTMSB

Address offset: 0x13
Die temperature measurement result MSB

Reset 0x00

0

0 0 0 0 0 0 0

Bit number

7

6 5 4 3 2 1 0

ID

A A A A A A A A

Reset 0x00

0

0 0 0 0 0 0 0

Bit number

7

6 5 4 3 2 1 0

ID

D D C C B B A A

ID

R/W Field

A

R

Value ID

Value

Description

TEMPRESULTMSB

Die temperature measurement result MSB

##### 7.1.10.17 ADCVSYSRESULTMSB

Address offset: 0x14
VSYS measurement result MSB

ID

R/W Field

A

R

Value ID

Value

Description

VSYSRESULTMSB

VSYS measurement result MSB

##### 7.1.10.18 ADCGP0RESULTLSBS

Address offset: 0x15
Result LSBs (VBAT, battery temperature, die temperature and VSYS)

Reset 0x00

0

ID

R/W Field

Value ID

Value

Description

A

R

VBATRESULTLSB

Battery voltage measurement result LSBs

B

R

NTCRESULTLSB

Battery temperature measurement result LSBs

C

R

TEMPRESULTLSB

Die temperature measurement result LSBs

D

R

VSYSRESULTLSB

VSYS measurement result LSBs

##### 7.1.10.19 ADCVBAT0RESULTMSB

Address offset: 0x16
VBAT0 burst measurement result MSB
4548_062 v1.0

105

0 0 0 0 0 0 0

System features
Bit number

7

ID

A A A A A A A A

Reset 0x00

0

0 0 0 0 0 0 0

Bit number

7

6 5 4 3 2 1 0

ID

A A A A A A A A

ID

R/W Field

A

R

Value ID

Value

6 5 4 3 2 1 0

Description

VBAT0RESULTMSB

VBAT0 burst measurement result MSB

##### 7.1.10.20 ADCVBAT1RESULTMSB

Address offset: 0x17
VBAT1 burst measurement result MSB

Reset 0x00

0

0 0 0 0 0 0 0

Bit number

7

6 5 4 3 2 1 0

ID

A A A A A A A A

Reset 0x00

0

0 0 0 0 0 0 0

Bit number

7

6 5 4 3 2 1 0

ID

A A A A A A A A

ID

R/W Field

A

R

Value ID

Value

Description

VBAT1RESULTMSB

VBAT1 burst measurement result MSB

##### 7.1.10.21 ADCVBAT2RESULTMSB

Address offset: 0x18
VBAT2 burst measurement result MSB

ID

R/W Field

A

R

Value ID

Value

Description

VBAT2RESULTMSB

ADC VBAT2 burst measurement result MSB

##### 7.1.10.22 ADCVBAT3RESULTMSB

Address offset: 0x19
VBAT3 burst or VBUS measurement result MSB

Reset 0x00

0

ID

R/W Field

A

R

Value ID

Value

0 0 0 0 0 0 0

Description

VBAT3RESULTMSB

If TASKVBATMEASURE is triggered in burst mode, this register will contain
ADC VBAT3 burst measurement result MSB If TASKVBUS7MEASURE is
triggered, this register will contain VBUS measurement result MSB

##### 7.1.10.23 ADCGP1RESULTLSBS

Address offset: 0x1A
VBAT burst measurement result LSBs (VBAT0, VBAT1, VBAT2 and VBAT3)

System features
Bit number

7

ID

D D C C B B A A

Reset 0x00

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

ID

R/W Field

A

R

VBAT0RESULTLSB

Value ID

Value

Burst VBAT0 measurement result LSBs

B

R

VBAT1RESULTLSB

Burst VBAT1 measurement result LSBs

C

R

VBAT2RESULTLSB

Burst VBAT2 measurement result LSBs

D

R

VBAT3RESULTLSB

Burst VBAT3 measurement result LSBs

6 5 4 3 2 1 0

Description

##### 7.1.10.24 ADCIBATMEASEN

Address offset: 0x24
Enable automatic battery current measurement
Bit number
ID

A

Reset 0x00

0

ID

R/W Field

A

RW

Value ID

Value

0 0 0 0 0 0 0

Description

IBATMEASENABLE

Enable IBAT measurement after VBAT measurement

### 7.2 POF — Power-fail comparator

The power-fail comparator (POF) provides the host with an early warning of an impending power supply
failure.
POF is generated from an always active comparator monitoring the voltage on the VSYS pin. It can be
configured through POFCONFIG on page 109 to give a warning through a GPIO to the host.
If voltage on the VSYS pin drops below VSYSPOF, but voltage remains above the respective BOR threshold
on the VBAT or VBUS pins, the VSYS pin is disabled after tPOFWAIT and registers are reset after tPWRDN. If
VSYS > VSYSPOF, the chip powers up after tPWRDN. See Power fail warning on page 108.
Note: Before setting VSYSPOF, voltage on the VSYS pin must be higher than the selected threshold
or it triggers a POF event and resets the device. The POF threshold is also reset to the default
setting. VSYSPOF must be set to a higher voltage than the battery undervoltage protection level to
avoid triggering the protection circuit. When VSYS > VSYSPOF, BUCK may start up again depending
on VSET[n] pin configuration.
If configured, a power failure warning is issued in the following cases:
• •
• •
• VBUS is removed while the battery is empty or not connected (VBAT < VSYSPOF)
VBUS rises above VBUSOVP while the battery is empty or not connected (VBAT < VSYSPOF)
The battery is removed when VBUS is not connected
The battery discharges until VBAT < VSYSPOF and VBUS is not connected
Battery voltage drops momentarily below VSYSPOF and VBUS is not connected

System features
VSYS drops
momentarily
Normal
VSYS

Power up
Power
down
Boot up/Normal
&
reset
mode

VBUSOUT
LSOUT[n] (LOADSW)

Host software configuration
No act. cap disch.

VOUT[n] (BUCK)

VSET[n] config Host software configuration

POF (GPIO)

Host software configuration
tPOFWAIT

Input, pull-down

tPWRDN

VBUS and/or VBAT remain over POR levels

Device reset
POF threshold reset

*Figure 44: Power fail warning*

VSYS drops down

Normal

No supply
No VBAT or VBUS

VSYS
VBUSOUT
LSOUT[n] (LOADSW)

No act. cap disch.

VOUT[n] (BUCK)
POF (GPIO)

Input, pull-down

tPOFWAIT
Device internal reset by
VBATBOR/VBUSBOR

*Figure 45: Power removal*

To use the POF warning feature, set POFWARNPOLARITY and POFENA to 1 in register POFCONFIG on page
109. GPIO settings are located in GPIO — General purpose input/output on page 83.

#### 7.2.1 Electrical specification

System features
Symbol

Description

Min.

POF

VSYSPOF rising threshold, default

Typ.

Max.

Unit

2.8

V

Always 100 mV (typ.) above the falling
threshold
VSYSPOF

Minimum setting VSYSPOF falling threshold

2.5

V

VSYSPOF

Default setting VSYSPOF falling threshold

2.7

V

VSYSPOF

Maximum setting VSYSPOF falling threshold

3.4

V

tPOF

Reaction time (from crossing the threshold
to edge on the warning signal)

1

ms

tPWRDN

Time in power-down mode

100

ms

tPOFWAIT

Delay before enabling the active output
capacitor discharge and disconnecting
VBAT and VBUS from VSYS

30

ms

*Table 27: POF electrical specification*

#### 7.2.2 Registers

Instances
Instance

Base address

Description

POF

0x00000900

POF registers
POF register map

Register overview
Register

Offset

Description

POFCONFIG

0x0

Configuration for power failure

##### 7.2.2.1 POFCONFIG

Address offset: 0x0
Configuration for power failure
Bit number

7

ID

C C C C B A

Reset 0x00

0

ID

R/W Field

A

RW

B

C

6 5 4 3 2 1 0

RW

RW

Value ID

Value

Description

OFF

0

Warning disabled

ENABLED

1

Warning enabled

POFENA

Enable power failure warning

POFWARNPOLARITY

Power failure warning polarity
LOACTIVE

0

Active low

HIACTIVE

1

Active high

2V8

0

POFVSYSTHRESHSEL

4548_062 v1.0

Power failure threshold select
2.8 V

109

0 0 0 0 0 0 0

System features
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

ID

C C C C B A

Reset 0x00
ID

R/W Field

Value ID

Value

Description

2V6

1

2.6 V

2V7

2

2.7 V

2V9

3

2.9 V

3V0

4

3.0 V

3V1

5

3.1 V

3V2

6

3.2 V

3V3

7

3.3 V

3V4

8

3.4 V

3V5

9

3.5 V

unused10

10

2.8 V

unused11

11

2.8 V

unused12

12

2.8 V

unused13

13

2.8 V

unused14

14

2.8 V

unused15

15

2.8 V

### 7.3 TIMER — Timer/monitor

TIMER can be used in the following ways, depending on configuration.
• •
• •

Boot monitor
Watchdog timer
Wake-up timer
General purpose timer

TIMER is a 24-bit timer running at the frequency of the timer clock, fTIMER, and has a prescaler.
TIMER only runs one configuration at a time because it is shared for all functions. The wake-up timer
wakes the system at a programmable interval when the device is in Hibernate mode. Do not use the
watchdog timer or general purpose timer when the system is in Ship or Hibernate mode.
TIMER is controlled by register TIMERCONFIG on page 114. The start value is configured with
TIMERHIBYTE on page 115, TIMERMIDBYTE on page 115, and TIMERLOBYTE on page 116. The
settings are applied with TIMERTARGETSTROBE on page 114. TIMER is started with TIMERSET on page
113 and is stopped with TIMERCLR on page 114.
Example settings are shown in the following table.
fTIMER

TIMERHIBYTE

TIMERMIDBYTE

TIMERLOBYTE

Time

2 ms

0

0

250

0.5 s

16 ms

0

0

250

4s

16 ms

0

1

0

4.096 s

16 ms

1

0

0

1048.576 s

16 ms

255

255

255

74.5 h

*Table 28: Example timer register settings*

System features

#### 7.3.1 Boot monitor

After a power-on reset, the default timer is boot monitor and this is disabled. When enabled, it allows an
automatic power cycle if the host does not set bit TASK.TIMER.DIS within tBOOT.
Host software can enable the boot monitor with bit BOOT.TIMER.EN. It can disable the boot monitor to
prevent interference with firmware updates. When enabled, the boot monitor remains enabled even if the
chip is reset, except for a power-on reset. Removing both VBAT and VBUS, or clearing the BOOT.TIMER.EN
bit, deactivates the timer during the next power-up.

#### 7.3.2 Watchdog timer

Watchdog timer expiration can be configured by host software to generate an NRESETOUT through a GPIO
or a power cycle.
Power cycle means internally disconnecting VSYS from VBAT and VBUS. BUCK and LOADSW are actively
pulled low for 100 ms. The device is reset and BUCK is re-enabled. Active pull-downs are present at pin
VOUT1, VOUT2, LSOUT1, and LS2OUT2 during tPWRDN.
The watchdog timer can issue a pre-warning interrupt, tPREWARN, before expiration. The reset pulse,
which is active-low, through the NRESETOUT GPIO lasts for tRESET. Watchdog can be configured in register
WATCHDOGKICK on page 114.
The pre-warning interrupt is generated one cycle of the selected prescaler, either 2 ms or 16 ms, before
expiry of the watchdog occurs.
The following figure shows a watchdog reset where the nPM1304 device is not reset internally.
Watchdog expires
Normal

Normal

VSYS
LSOUT[n] (LOADSW)
VOUT[n] (BUCK)
NRESETOUT (GPIO)
tRESET

*Figure 46: Watchdog reset*

System features

Boot monitor hits /
Watchdog expires /
Reset button long press /
Thermal shutdown
Normal

Power up

Power down &
reset mode

Boot up / Normal

VSYS
VBUSOUT
LSOUT[n] (LOADSW)

(Active cap discharge)

VOUT[n] (BUCK)

(Active cap discharge)

Host software
configuration
VSETx config

Host software
configuration

tPWRDN
Device internal reset

*Figure 47: Power cycle*

Note: For the thermal shutdown case, tPWRDN will be longer as it waits for the die temperature to
cool down below TSD - TSDHYST.

#### 7.3.3 Wake-up timer

The wake-up timer wakes the system from Hibernate mode.
Host software configures the timer before the device enters Hibernate mode, see Ship and Hibernate
modes on page 116.

#### 7.3.4 General purpose timer

The general purpose timer interrupts the host after a timeout with the WATCHDOG.WARNING event.
Prescaler is configured in register TIMERCONFIG on page 114 with the default set to 16 ms.
When the prescaler is configured to 16 ms in TIMERCONFIG on page 114 and TIMERHIBYTE on page
115 is 5, TIMERMIDBYTE on page 115 is 2 and TIMERLOBYTE on page 116 is 1, then the general
purpose timer will wake after 5251 seconds.

#### 7.3.5 Electrical specification

Both prescaler settings 16 ms and (2 ms) are included. Values in parenthesis are for the 2 ms prescaler.

System features
Symbol

Description

Min.

fTIMER

Frequency of timer clock

Typ.
64

Max.

Unit
Hz

(512)
tPREWARN

tPER_MIN

Time between watchdog timer interrupt
and reset/power cycle

16

ms

(2)

Minimum time period

16

ms

(2)
tPER_MAX

Maximum time period

3

days

(9)

(hours)

tBOOT

Amount of time before a power cycle is
performed when no traffic is observed on
TWI and BOOT.TIMER.EN is set

10

s

tPWRDN

Length of power cycle

100

ms

tRESET

Length of reset pulse

100

ms

fACCUR

Accuracy of timer clock

±3

%

*Table 29: TIMER electrical specification*

#### 7.3.6 Registers

Instances
Instance

Base address

Description

TIMER

0x00000700

TIMER registers
TIMER register map

Register overview
Register

Offset

Description

TIMERSET

0x0

Start timer

TIMERCLR

0x1

Stop timer

TIMERTARGETSTROBE

0x3

Strobe for timer target

WATCHDOGKICK

0x4

Watchdog kick

TIMERCONFIG

0x5

Timer mode selection

TIMERSTATUS

0x6

Timers status

TIMERHIBYTE

0x8

Timer most significant byte

TIMERMIDBYTE

0x9

Timer middle byte

TIMERLOBYTE

0xA

Timer least significant byte

##### 7.3.6.1 TIMERSET

Address offset: 0x0
Start timer

System features
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

ID

A

Reset 0x00
ID

R/W Field

A

W

Value ID

Value

Description

NOEFFECT

0

No effect

SET

1

Timer start request

TASKTIMEREN

Start timer

##### 7.3.6.2 TIMERCLR

Address offset: 0x1
Stop timer
Bit number
ID

A

Reset 0x00
ID

R/W Field

A

W

Value ID

Value

Description

NOEFFECT

0

No effect

SET

1

Timer stop request

TASKTIMERDIS

Stop timer

##### 7.3.6.3 TIMERTARGETSTROBE

Address offset: 0x3
Strobe for timer target
Bit number
ID

A

Reset 0x00
ID

R/W Field

A

W

Value ID

Value

Description

TASKTIMERTARGETSTROBE

Timer target strobe

NOEFFECT

0

No effect

SET

1

Load timer target (24-bit timer value)

##### 7.3.6.4 WATCHDOGKICK

Address offset: 0x4
Watchdog kick
Bit number
ID

A

Reset 0x00
ID

R/W Field

A

W

Value ID

Value

Description

NOEFFECT

0

No effect

Kick

1

Kick watchdog

TASKWATCHDOGKICK

Watchdog kick

##### 7.3.6.5 TIMERCONFIG

Address offset: 0x5
Timer mode selection

System features
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

ID

B A A A

Reset 0x00
ID

R/W Field

A

RW

B

RW

Value ID

Value

BOOTMONITOR

0

Description

TIMERMODESEL

Select watchdog and timer modes
Boot monitor

WATCHDOGWARNING1

Watchdog warning

WATCHDOGRESET

Watchdog reset

2

GENPURPOSETIMER 3

General purpose timer

WAKEUPTIMER

4

Wakeup timer

SLOW

0

16 ms prescaler

FAST

1

2 ms prescaler

TIMERPRESCALER

Select between 16 ms and 2 ms timer prescaler

##### 7.3.6.6 TIMERSTATUS

Address offset: 0x6
Timers status
Bit number
ID

B A

Reset 0x00

0

0 0 0 0 0 0 0

Bit number

7

6 5 4 3 2 1 0

ID

A A A A A A A A

ID

R/W Field

A

R

B

R

Value ID

Value

Description

BOOTMONITORACTIVE

Boot monitor active

INACTIVE

0

Boot monitor not running

ACTIVE

1

Boot monitor running

SLOWDOMAINCONFIGURED

Timer ready after TIMERTARGETSTROBE

NOTCONFIG

0

Not configured

CONFIG

1

Timer configured

##### 7.3.6.7 TIMERHIBYTE

Address offset: 0x8
Timer most significant byte

Reset 0x00

0

0 0 0 0 0 0 0

Bit number

7

6 5 4 3 2 1 0

ID

A A A A A A A A

ID

R/W Field

A

RW

Value ID

Value

Description

TIMERHIBYTE

Timer most significant byte

##### 7.3.6.8 TIMERMIDBYTE

Address offset: 0x9
Timer middle byte

Reset 0x00

0

ID

R/W Field

A

RW

Value ID

Value

Description

TIMERMIDBYTE

4548_062 v1.0

Timer middle byte

115

0 0 0 0 0 0 0

System features

##### 7.3.6.9 TIMERLOBYTE

Address offset: 0xA
Timer least significant byte
Bit number

7

ID

A A A A A A A A

Reset 0x00

0

ID

R/W Field

A

RW

Value ID

Value

6 5 4 3 2 1 0

0 0 0 0 0 0 0

Description

TIMERLOBYTE

Timer least significant byte

### 7.4 Ship and Hibernate modes

Ship and Hibernate modes isolate the battery from the system and minimize the quiescent current.
Hibernate mode is identical to Ship mode with the exception that, in Hibernate mode, the timer is running
and functions as an additional wake-up source.
The device enters Ship mode through register TASKENTERSHIPMODE on page 118. Register
SHPHLDCONFIG on page 118 configures the SHPHLD button press time, and register
TASKSHPHLDCFGSTROBE on page 118 applies the configured value. When VBUS is not present, the
device enters Ship mode immediately. The host software must wait until EVENTSVBUSIN0SET on page
136 to ensure VBUS is disconnected and discharged before writing to the register.
The device enters Hibernate mode through register TASKENTERHIBERNATE on page 117. The host
software must wait until EVENTSVBUSIN0SET on page 136 to ensure VBUS is disconnected and
discharged before writing to the register. To apply the timer value, registers TIMERHIBYTE on page 115,
TIMERMIDBYTE on page 115, and TIMERLOBYTE on page 116 must be configured before register
TIMERTARGETSTROBE on page 114. In Hibernate mode, the quiescent current is higher compared to
Ship mode because the low-power timer is running.
Exiting Hibernate mode using a button press must be configured in register SHPHLDCONFIG on page
118 and TASKSHPHLDCFGSTROBE on page 118.
When entering Ship mode, BUCK can be configured to discharge by enabling their pull downs, see
BUCKCTRL0 on page 66.
Note: SHPHLDCONFIG on page 118 and TASKSHPHLDCFGSTROBE on page 118 must be set
before entering either Ship or Hibernate modes.
The following are alternative ways to exit Ship and Hibernate modes.
• Pulling pin SHPHLD low for a minimum period of tshipToActive (see SHPHLDCONFIG on page 118). A
push button to GND is required.
• Applying a voltage on VBUS > VBUSPOR.
• Exiting automatically through the Wake-up timer (only from Hibernate mode).

#### 7.4.1 Electrical specification

System features
Symbol

Description

Min.

tshipToActive

Duration SHPHLD pin must be held low to
exit Ship or Hibernate mode

Typ.

Max.

16

Unit
ms

32
64
96
(default)
304
608
1008
3008

VIL

Input low voltage for SHPHLD pin

AVSS

0.4

V

1.2

VBAT

V

VIH

Input high voltage for SHPHLD pin

tRESETBUT

Amount of time for a button press to cause
a power cycle

10

s

RSHPHLD

Pull-up resistor on SHPHLD pin

50

kΩ

*Table 30: Ship mode electrical specification*

#### 7.4.2 Registers

Instances
Instance

Base address

Description

SHIP

0x00000B00

SHIP registers
SHPHLD register map

Register overview
Register

Offset

Description

TASKENTERHIBERNATE

0x0

Enter Hibernate

TASKSHPHLDCFGSTROBE

0x1

Load SHPHLD configuration

TASKENTERSHIPMODE

0x2

Enter Ship mode

TASKRESETCFG

0x3

Reset configuration

SHPHLDCONFIG

0x4

Configuration for SHPHLD

SHPHLDSTATUS

0x5

Status of the SHPHLD pin

LPRESETCONFIG

0x6

Long press reset configuration

##### 7.4.2.1 TASKENTERHIBERNATE

Address offset: 0x0
Enter Hibernate

System features
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

ID

A

Reset 0x00
ID

R/W Field

A

W

Value ID

Value

Description

TASKENTERHIBERNATE

Enter Hibernate (Ship mode with Wake-up timer)

NOEFFECT

0

No effect

TRIGGER

1

Trigger task

##### 7.4.2.2 TASKSHPHLDCFGSTROBE

Address offset: 0x1
Load SHPHLD configuration
Bit number
ID

A

Reset 0x00
ID

R/W Field

A

W

Value ID

Value

Description

TASKSHPHLDCONFIGSTROBE

Load the SHPHLD configuration

NOEFFECT

0

No effect

TRIGGER

1

Strobe config

##### 7.4.2.3 TASKENTERSHIPMODE

Address offset: 0x2
Enter Ship mode
Bit number
ID

A

Reset 0x00
ID

R/W Field

A

W

Value ID

Value

Description

TASKENTERSHIPMODE

Enter Ship mode (without Wake-up timer)

NOEFFECT

0

No effect

TRIGGER

1

Trigger task

##### 7.4.2.4 TASKRESETCFG

Address offset: 0x3
Reset configuration
Bit number
ID

A

Reset 0x00
ID

R/W Field

A

W

Value ID

Value

Description

TASKSHPHLDRSTCONFIG

Reset configuration settings

NOEFFECT

0

No effect

TRIGGER

1

Reset

##### 7.4.2.5 SHPHLDCONFIG

Address offset: 0x4
Configuration for SHPHLD

System features
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 1 1

7

6 5 4 3 2 1 0

ID

A A A

Reset 0x03
ID

R/W Field

A

RW

Value ID

Value

Description

16ms

0

16 ms

32ms

1

32 ms

64ms

2

64 ms

96ms

3

96 ms (default)

304ms

4

304 ms

608ms

5

608 ms

1008ms

6

1008 ms

3008ms

7

3008 ms

SHPHLDTIM

Configuration for SHPHLD debounce

##### 7.4.2.6 SHPHLDSTATUS

Address offset: 0x5
Status of the SHPHLD pin
Bit number
ID

A

Reset 0x00
ID

R/W Field

A

R

Value ID

Value

LOW

0

Low

HIGH

1

High

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

Description

SHPHLDPINSTATUS

SHPHLD pin status

##### 7.4.2.7 LPRESETCONFIG

Address offset: 0x6
Long press reset configuration
Bit number
ID

B A

Reset 0x00

0

ID

R/W Field

A

RW

B

RW

Value ID

Value

ENABLED

0

Long press reset enabled

DISABLED

1

Long press reset disabled

0 0 0 0 0 0 0

Description

LONGTIMRESETDIS

Long press reset disable

LONGTIMTWOBUTTONSEL

Select one (default) or two buttons to perform long press reset

SHPHLD

0

One button (SHPHLD)

SHPHLDGPIO0

1

Two buttons (SHPHLD and GPIO0)

### 7.5 RESET — Reset control

The SHPHLD pin is a reset control, in addition to being used for exiting Ship and Hibernate mode.

The SHPHLD pin has an internal pull-up resistor RSHPHLD to VBAT or VBUS depending on which has the
highest voltage. The functionality of the pin is determined by the device mode.

System features

Normal operation
If configured, a short logic-low pulse on SHPHLD sends an interrupt to the host. Host software reads the
pin state in register SHPHLDSTATUS on page 119.
A long logic-low (> tRESETBUT ) on SHPHLD causes a power cycle and resets the whole system. This feature is
enabled by default after power-up, but can be disabled by the host software. See register LPRESETCONFIG
on page 119 for more information.

Ship and Hibernate modes
When a logic-low occurs for longer than tshipToActive, the device wakes up from Ship or Hibernate mode,
performs an internal reset, and transitions to normal operation.

Two-button reset
A two-button reset is implemented by connecting one button to the SHPHLD pin and another
button to GPIO0. This feature is enabled by setting LPRESETCONFIG on page 119, and then
TASKSHPHLDCFGSTROBE on page 118 to apply the configured value. In addition, GPIO0 needs to be
configured as input using GPIOMODE[0] on page 86 and the internal pull-down needs to be disabled in
GPIOPDEN[0] on page 91. Internal pull-up can be enabled in GPIOPUEN[0] on page 89 in case there is no
external pull-up resistor. Pressing and holding both buttons for longer than tRESETBUT starts a power cycle.

Host software reset
Host software can reset the device by writing the TASKSWRESET bit in register TASKSWRESET on page
123. As a consequence, a power cycle is performed. A reset is not possible in Ship or Hibernate mode.

Scratch registers, reason for reset
Only POR and TASKCLRERRLOG can initialize the context registers found at SCRATCH[n]. The cause of the
first reset is reported in register RSTCAUSE on page 146.

### 7.6 TWI — I2C compatible two-wire interface

TWI is a two-wire interface that controls and monitors the device state through registers.

Main Features
• I2C compatible up to 400 kHz
• TWI clock supports 100 kHz to 1 MHz
A GPIO pin can be set as an interrupt pin, see GPIO — General purpose input/output on page 83.

Interface supply
TWI is supplied by VDDIO. It is recommended to connect VDDIO to a BUCK output, VOUT1, or VOUT2.
VDDIO must be present in all operating modes of the chip, except in Ship and Hibernate modes.

Addressing
The 7-bit slave address is 110 1011.
The registers have 16-bit addressing and 8-bit data. The upper address byte is the register instance base
address (bank address). The lower byte is the offset within an instance (bank).

System features

S

Start

0

Write

A

Acknowledge

P

Stop

Device address (7 bits)

S

A6

A5

A4

A3

A2

A1

Register address (16 bits)

A0

0

A

B15 B14 B13 B12 B11 B10 B9

B8

A

B7

B6

B5

B4

B3

B2

B1

B0

A

D7 D6 D5 D4 D3 D2 D1 D0

A

P

B0

A

D7 D6 D5 D4 D3 D2 D1 D0 NA

P

Data byte to register (8 bits)

*Figure 48: TWI write example*

S

Start

1

Read

0

Write

NA

Not acknowledged

A

Acknowledge

P

Stop

Sr

Repeated start

Device address (7 bits)

S

A6

A5

A4

A3

A2

A1

Register address (16 bits)

A0

0

A

B15 B14 B13 B12 B11 B10 B9

B8

A

Device address (7 bits)

Sr

A6

A5

A4

A3

A2

A1

B7

B6

B5

B4

B3

B2

Data byte from register (8 bits)

A0

1

A

*Figure 49: TWI read example*

#### 7.6.1 TWI timing diagram

SCL
tHD_STA

tSU_DAT

tHD_DAT

1/fSCL

tSU_STO

SDA

*Figure 50: TWI timing diagram*

#### 7.6.2 Electrical specification

4548_062 v1.0

121

B1

tBUF

System features
Symbol

Description

Min.

Typ.

Max.

Units

1000

kbps

fSCL

Bit rate for TWI

100

tSU_DAT

Data setup time before positive edge on
SCL, all modes

50

ns

tHD_DAT

Data hold time after negative edge on
SCL, all modes

0

ns

tHD_STA

Hold time from for START condition (SDA
low to SCL low), 100 kbps

260

ns

tSU_STO

Setup time from SCL high to STOP
condition, 100 kbps

260

ns

tBUF

Bus free time between STOP and START
conditions

500

*Table 31: TWI electrical specification*

### 7.7 Event, interrupt and revision registers

This section details the event, interrupt and device revision related registers.

Device revision
The revision information is available in registers REVISIONMSB and REVISIONLSB. See nPM1304
Compatibility Matrix for details.

#### 7.7.1 Registers

Instances
Instance

Base address

Description

MAIN

0x00000000

MAIN registers
MAIN Register map

Register overview
Register

Offset

Description

TASKSWRESET

0x1

Task force a full reboot power-cycle

EVENTSADCSET

0x2

ADC Event Set

EVENTSADCCLR

0x3

ADC Event Clear

INTENEVENTSADCSET

0x4

ADC Interrupt Enable Set

INTENEVENTSADCCLR

0x5

ADC Interrupt Enable Clear

EVENTSBCHARGER0SET

0x6

Battery temperature region and die temperature Event Set

EVENTSBCHARGER0CLR

0x7

Battery temperature region and die temperature Event Clear

INTENEVENTSBCHARGER0SET

0x8

Battery temperature region and die temperature Interrupt Enable Set

INTENEVENTSBCHARGER0CLR

0x9

Battery temperature region and die temperature Interrupt Enable Clear

EVENTSBCHARGER1SET

0xA

Charger Event Set

EVENTSBCHARGER1CLR

0xB

Charger Event Clear

INTENEVENTSBCHARGER1SET

0xC

Charger Interrupt Enable Set

4548_062 v1.0

122

ns

System features
Register

Offset

Description

INTENEVENTSBCHARGER1CLR

0xD

Charger Interrupt Enable Clear

EVENTSBCHARGER2SET

0xE

Battery Event Set

EVENTSBCHARGER2CLR

0xF

Battery Event Clear

INTENEVENTSBCHARGER2SET

0x10

Battery Interrupt Enable Set

INTENEVENTSBCHARGER2CLR

0x11

Battery Interrupt Enable Clear

EVENTSSHPHLDSET

0x12

SHPHLD pin and watchdog Event Set

EVENTSSHPHLDCLR

0x13

SHPHLD pin and watchdog Event Clear

INTENEVENTSSHPHLDSET

0x14

SHPHLD pin and watchdog Interrupt Enable Set

INTENEVENTSSHPHLDCLR

0x15

SHPHLD pin and watchdog Interrupt Enable Clear

EVENTSVBUSIN0SET

0x16

VBUS Event Set

EVENTSVBUSIN0CLR

0x17

VBUS Event Clear

INTENEVENTSVBUSIN0SET

0x18

VBUS Interrupt Enable Set

INTENEVENTSVBUSIN0CLR

0x19

VBUS Interrupt Enable Clear

EVENTSVBUSIN1SET

0x1A

Thermal and charger detection Event Set

EVENTSVBUSIN1CLR

0x1B

Thermal and charger detection Event Clear

INTENEVENTSVBUSIN1SET

0x1C

Thermal and charger detection Interrupt Enable Set

INTENEVENTSVBUSIN1CLR

0x1D

Thermal and charger detection Interrupt Enable Clear

EVENTSGPIOSET

0x22

GPIO Event Set

EVENTSGPIOCLR

0x23

GPIO Event Clear

INTENEVENTSGPIOSET

0x24

GPIO Interrupt Enable Set

INTENEVENTSGPIOCLR

0x25

GPIO Interrupt Enable Clear

REVISIONMSB

0x26

Revision MSB. See nPM1304 Compatibility Matrix for details.

REVISIONLSB

0x27

Revision LSB. See nPM1304 Compatibility Matrix for details.

##### 7.7.1.1 TASKSWRESET

Address offset: 0x1
Task force a full reboot power-cycle
Bit number

7

6 5 4 3 2 1 0

ID

A

Reset 0x00

0

0 0 0 0 0 0 0

Bit number

7

6 5 4 3 2 1 0

ID

H G F E D C B A

ID

R/W Field

A

W

Value ID

Value

Description

NOEFFECT

0

No effect

TRIGGER

1

Trigger task

TASKSWRESET

Turn off all supplies and apply internal reset

##### 7.7.1.2 EVENTSADCSET

Address offset: 0x2
ADC Event Set

Reset 0x00

0

ID

R/W Field

A

RW

Value ID

Value

0 0 0 0 0 0 0

Description

EVENTADCVBATRDY

VBAT measurement finished. Writing 1 sets the event (for debugging).

W1S

B

RW

LOW

0

Low

HIGH

1

High

EVENTADCNTCRDY

Battery NTC measurement finished. Writing 1 sets the event (for

W1S

4548_062 v1.0

debugging).

System features
Bit number

7

ID

H G F E D C B A

Reset 0x00

0

ID

C

R/W Field

RW

Value ID

Value

Description

LOW

0

Low

HIGH

1

High

EVENTADCTEMPRDY

RW

(for debugging).
LOW

0

Low

HIGH

1

High

EVENTADCVSYSRDY

VSYS voltage measurement measurement finished. Writing 1 sets the event

W1S

E

RW

0 0 0 0 0 0 0

Internal die temperature measurement finished. Writing 1 sets the event

W1S

D

6 5 4 3 2 1 0

(for debugging).
LOW

0

Low

HIGH

1

High

EVENTADCVSET1RDY

VSET1 pin measurement finished. Writing 1 sets the event (for debugging).

W1S

F

RW

LOW

0

Low

HIGH

1

High

EVENTADCVSET2RDY

VSET2 pin measurement finished. Writing 1 sets the event (for debugging).

W1S

G

RW

LOW

0

Low

HIGH

1

High

EVENTADCIBATRDY

IBAT measurement finished. Writing 1 sets the event (for debugging).

W1S

H

RW

LOW

0

Low

HIGH

1

High

EVENTADCVBUS7V0RDY

VBUS measurement finished. Writing 1 sets the event (for debugging).

W1S
LOW

0

Low

HIGH

1

High

##### 7.7.1.3 EVENTSADCCLR

Address offset: 0x3
ADC Event Clear
Bit number

7

ID

H G F E D C B A

Reset 0x00

0

ID

R/W Field

A

RW

Value ID

Value

RW

EVENTADCVBATRDY

VBAT measurement finished. Writing 1 clears the event (e.g. to acknowledge
an interrupt).
LOW

0

Low

HIGH

1

High

EVENTADCNTCRDY

Battery NTC measurement finished. Writing 1 clears the event (e.g. to

W1C

C

RW

0 0 0 0 0 0 0

Description

W1C

B

6 5 4 3 2 1 0

acknowledge an interrupt).
LOW

0

Low

HIGH

1

High

EVENTADCTEMPRDY

Internal die temperature measurement finished. Writing 1 clears the event

W1C

4548_062 v1.0

(e.g. to acknowledge an interrupt).
LOW

0

Low

HIGH

1

High

System features
Bit number

7

ID

H G F E D C B A

Reset 0x00

0

ID

R/W Field

D

RW

Value ID

Value

RW

VSYS voltage measurement measurement finished. Writing 1 clears the
event (e.g. to acknowledge an interrupt).
LOW

0

Low

HIGH

1

High

EVENTADCVSET1RDY

VSET1 pin measurement finished. Writing 1 clears the event (e.g. to

W1C

F

RW

acknowledge an interrupt).
LOW

0

Low

HIGH

1

High

EVENTADCVSET2RDY

VSET2 pin measurement finished. Writing 1 clears the event (e.g. to

W1C

G

RW

acknowledge an interrupt).
LOW

0

Low

HIGH

1

High

EVENTADCIBATRDY

IBAT measurement finished. Writing 1 clears the event (e.g. to acknowledge

W1C

H

RW

0 0 0 0 0 0 0

Description

EVENTADCVSYSRDY

W1C

E

6 5 4 3 2 1 0

an interrupt).
LOW

0

Low

HIGH

1

High

EVENTADCVBUS7V0RDY

VBUS measurement finished. Writing 1 clears the event (e.g. to

W1C

acknowledge an interrupt).
LOW

0

Low

HIGH

1

High

##### 7.7.1.4 INTENEVENTSADCSET

Address offset: 0x4
ADC Interrupt Enable Set
Bit number

7

ID

H G F E D C B A

Reset 0x00

0

ID

R/W Field

A

RW

Value ID

Value

Description

EVENTADCVBATRDY

Writing 1 enables interrupts from EVENTADCVBATRDY

W1S

B

RW

LOW

0

Low

HIGH

1

High

EVENTADCNTCRDY

Writing 1 enables interrupts from EVENTADCNTCRDY

W1S

C

RW

LOW

0

Low

HIGH

1

High

EVENTADCTEMPRDY

Writing 1 enables interrupts from EVENTADCTEMPRDY

W1S

D

RW

LOW

0

Low

HIGH

1

High

EVENTADCVSYSRDY

Writing 1 enables interrupts from EVENTADCVSYSRDY

W1S

E

RW

LOW

0

Low

HIGH

1

High

EVENTADCVSET1RDY

Writing 1 enables interrupts from EVENTADCVSET1RDY

W1S
LOW

4548_062 v1.0

0

Low

125

6 5 4 3 2 1 0

0 0 0 0 0 0 0

System features
Bit number

7

ID

H G F E D C B A

Reset 0x00

0

ID
F

R/W Field
RW

Value ID

Value

Description

HIGH

1

High

EVENTADCVSET2RDY

6 5 4 3 2 1 0

0 0 0 0 0 0 0

Writing 1 enables interrupts from EVENTADCVSET2RDY

W1S

G

RW

LOW

0

Low

HIGH

1

High

EVENTADCIBATRDY

Writing 1 enables interrupts from EVENTADCIBATRDY

W1S

H

RW

LOW

0

Low

HIGH

1

High

EVENTADCVBUS7V0RDY

Writing 1 enables interrupts from EVENTADCVBUS7V0RDY

W1S
LOW

0

Low

HIGH

1

High

##### 7.7.1.5 INTENEVENTSADCCLR

Address offset: 0x5
ADC Interrupt Enable Clear
Bit number

7

ID

H G F E D C B A

Reset 0x00

0

ID

R/W Field

A

RW

Value ID

Value

Description

EVENTADCVBATRDY

Writing 1 disables interrupts from EVENTADCVBATRDY

W1C

B

RW

LOW

0

Low

HIGH

1

High

EVENTADCNTCRDY

Writing 1 disables interrupts from EVENTADCNTCRDY

W1C

C

RW

LOW

0

Low

HIGH

1

High

EVENTADCTEMPRDY

Writing 1 disables interrupts from EVENTADCTEMPRDY

W1C

D

RW

LOW

0

Low

HIGH

1

High

EVENTADCVSYSRDY

Writing 1 disables interrupts from EVENTADCVSYSRDY

W1C

E

RW

LOW

0

Low

HIGH

1

High

EVENTADCVSET1RDY

Writing 1 disables interrupts from EVENTADCVSET1RDY

W1C

F

RW

LOW

0

Low

HIGH

1

High

EVENTADCVSET2RDY

Writing 1 disables interrupts from EVENTADCVSET2RDY

W1C

G

RW

LOW

0

Low

HIGH

1

High

EVENTADCIBATRDY

Writing 1 disables interrupts from EVENTADCIBATRDY

W1C

4548_062 v1.0

126

6 5 4 3 2 1 0

0 0 0 0 0 0 0

System features
Bit number

7

ID

H G F E D C B A

Reset 0x00

0

ID

H

R/W Field

RW

Value ID

Value

Description

LOW

0

Low

HIGH

1

High

EVENTADCVBUS7V0RDY

6 5 4 3 2 1 0

0 0 0 0 0 0 0

Writing 1 disables interrupts from EVENTADCVBUS7V0RDY

W1C
LOW

0

Low

HIGH

1

High

##### 7.7.1.6 EVENTSBCHARGER0SET

Address offset: 0x6
Battery temperature region and die temperature Event Set
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

ID

F E D C B A

Reset 0x00
ID

R/W Field

A

RW

Value ID

Value

Description

EVENTNTCCOLD

Battery temperature in cold region. Writing 1 sets the event (for debugging).

W1S

B

RW

LOW

0

Low

HIGH

1

High

EVENTNTCCOOL

Battery temperature in cool region. Writing 1 sets the event (for debugging).

W1S

C

RW

LOW

0

Low

HIGH

1

High

EVENTNTCWARM

Battery temperature in warm region. Writing 1 sets the event (for

W1S

D

RW

debugging).
LOW

0

Low

HIGH

1

High

EVENTNTCHOT

Battery temperature in hot region. Writing 1 sets the event (for debugging).

W1S

E

RW

LOW

0

Low

HIGH

1

High

EVENTDIETEMPHIGH

Die temperature is over TCHGSTOP. Charging stops. Writing 1 sets the event

W1S

F

RW

(for debugging).
LOW

0

Low

HIGH

1

High

EVENTDIETEMPRESUME

Die temperature is under TCHGRESUME. Charging resumes. Writing 1 sets

W1S

the event (for debugging).
LOW

0

Low

HIGH

1

High

##### 7.7.1.7 EVENTSBCHARGER0CLR

Address offset: 0x7
Battery temperature region and die temperature Event Clear

System features
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

ID

F E D C B A

Reset 0x00
ID

R/W Field

A

RW

Value ID

Value

Description

EVENTNTCCOLD

Battery temperature in cold region. Writing 1 clears the event (e.g. to

W1C

B

RW

acknowledge an interrupt).
LOW

0

Low

HIGH

1

High

EVENTNTCCOOL

Battery temperature in cool region. Writing 1 clears the event (e.g. to

W1C

C

RW

acknowledge an interrupt).
LOW

0

Low

HIGH

1

High

EVENTNTCWARM

Battery temperature in warm region. Writing 1 clears the event (e.g. to

W1C

D

RW

acknowledge an interrupt).
LOW

0

Low

HIGH

1

High

EVENTNTCHOT

Battery temperature in hot region. Writing 1 clears the event (e.g. to

W1C

E

RW

acknowledge an interrupt).
LOW

0

Low

HIGH

1

High

EVENTDIETEMPHIGH

Die temperature is over TCHGSTOP. Charging stops. Writing 1 clears the

W1C

F

RW

event (e.g. to acknowledge an interrupt).
LOW

0

Low

HIGH

1

High

EVENTDIETEMPRESUME

Die temperature is under TCHGRESUME. Charging resumes. Writing 1 clears

W1C

the event (e.g. to acknowledge an interrupt).
LOW

0

Low

HIGH

1

High

##### 7.7.1.8 INTENEVENTSBCHARGER0SET

Address offset: 0x8
Battery temperature region and die temperature Interrupt Enable Set
Bit number

7

ID

F E D C B A

Reset 0x00

0

ID

R/W Field

A

RW

Value ID

Value

Description

EVENTNTCCOLD

Writing 1 enables interrupts from EVENTNTCCOLD

W1S

B

RW

LOW

0

Low

HIGH

1

High

EVENTNTCCOOL

Writing 1 enables interrupts from EVENTNTCCOOL

W1S

C

RW

LOW

0

Low

HIGH

1

High

EVENTNTCWARM

Writing 1 enables interrupts from EVENTNTCWARM

W1S

D

6 5 4 3 2 1 0

RW

LOW

0

Low

HIGH

1

High

EVENTNTCHOT

Writing 1 enables interrupts from EVENTNTCHOT

W1S
LOW

4548_062 v1.0

0

Low

128

0 0 0 0 0 0 0

System features
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

ID

F E D C B A

Reset 0x00
ID
E

R/W Field
RW

Value ID

Value

Description

HIGH

1

High

EVENTDIETEMPHIGH

Writing 1 enables interrupts from EVENTDIETEMPHIGH

W1S

F

RW

LOW

0

Low

HIGH

1

High

EVENTDIETEMPRESUME

Writing 1 enables interrupts from EVENTDIETEMPRESUME

W1S
LOW

0

Low

HIGH

1

High

##### 7.7.1.9 INTENEVENTSBCHARGER0CLR

Address offset: 0x9
Battery temperature region and die temperature Interrupt Enable Clear
Bit number

7

6 5 4 3 2 1 0

ID

F E D C B A

Reset 0x00

0

ID

R/W Field

A

RW

Value ID

Value

0 0 0 0 0 0 0

Description

EVENTNTCCOLD

Writing 1 disables interrupts from EVENTNTCCOLD

W1C

B

RW

LOW

0

Low

HIGH

1

High

EVENTNTCCOOL

Writing 1 disables interrupts from EVENTNTCCOOL

W1C

C

RW

LOW

0

Low

HIGH

1

High

EVENTNTCWARM

Writing 1 disables interrupts from EVENTNTCWARM

W1C

D

RW

LOW

0

Low

HIGH

1

High

EVENTNTCHOT

Writing 1 disables interrupts from EVENTNTCHOT

W1C

E

RW

LOW

0

Low

HIGH

1

High

EVENTDIETEMPHIGH

Writing 1 disables interrupts from EVENTDIETEMPHIGH

W1C

F

RW

LOW

0

Low

HIGH

1

High

EVENTDIETEMPRESUME

Writing 1 disables interrupts from EVENTDIETEMPRESUME

W1C
LOW

0

Low

HIGH

1

High

##### 7.7.1.10 EVENTSBCHARGER1SET

Address offset: 0xA
Charger Event Set

System features
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

ID

F E D C B A

Reset 0x00
ID

R/W Field

A

RW

Value ID

Value

Description

EVENTSUPPLEMENT

Supplement mode activated. Writing 1 sets the event (for debugging).

W1S

B

RW

LOW

0

Low

HIGH

1

High

EVENTCHGTRICKLE

Tickle charge started. Writing 1 sets the event (for debugging).

W1S

C

RW

LOW

0

Low

HIGH

1

High

EVENTCHGCC

Constant current charging started. Writing 1 sets the event (for debugging).

W1S

D

RW

LOW

0

Low

HIGH

1

High

EVENTCHGCV

Constant voltage charging started. Writing 1 sets the event (for debugging).

W1S

E

RW

LOW

0

Low

HIGH

1

High

EVENTCHGCOMPLETED

Charging completed (battery full). Writing 1 sets the event (for debugging).

W1S

F

RW

LOW

0

Low

HIGH

1

High

EVENTCHGERROR

Charging error. Writing 1 sets the event (for debugging).

W1S
LOW

0

Low

HIGH

1

High

##### 7.7.1.11 EVENTSBCHARGER1CLR

Address offset: 0xB
Charger Event Clear
Bit number

7

ID

F E D C B A

Reset 0x00

0

ID

R/W Field

A

RW

Value ID

Value

RW

EVENTSUPPLEMENT

Supplement mode activated. Writing 1 clears the event (e.g. to acknowledge
an interrupt).
LOW

0

Low

HIGH

1

High

EVENTCHGTRICKLE

Tickle charge started. Writing 1 clears the event (e.g. to acknowledge an

W1C

C

RW

interrupt).
LOW

0

Low

HIGH

1

High

EVENTCHGCC

Constant current charging started. Writing 1 clears the event (e.g. to

W1C

D

RW

0 0 0 0 0 0 0

Description

W1C

B

6 5 4 3 2 1 0

acknowledge an interrupt).
LOW

0

Low

HIGH

1

High

EVENTCHGCV

Constant voltage charging started. Writing 1 clears the event (e.g. to

W1C

acknowledge an interrupt).
LOW

4548_062 v1.0

0

Low

System features
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

ID

F E D C B A

Reset 0x00
ID
E

R/W Field
RW

Value ID

Value

Description

HIGH

1

High

EVENTCHGCOMPLETED

Charging completed (battery full). Writing 1 clears the event (e.g. to

W1C

F

RW

acknowledge an interrupt).
LOW

0

Low

HIGH

1

High

EVENTCHGERROR

Charging error. Writing 1 clears the event (e.g. to acknowledge an interrupt).

W1C
LOW

0

Low

HIGH

1

High

##### 7.7.1.12 INTENEVENTSBCHARGER1SET

Address offset: 0xC
Charger Interrupt Enable Set
Bit number

7

6 5 4 3 2 1 0

ID

F E D C B A

Reset 0x00

0

ID

R/W Field

A

RW

Value ID

Value

0 0 0 0 0 0 0

Description

EVENTSUPPLEMENT

Writing 1 enables interrupts from EVENTSUPPLEMENT

W1S

B

RW

LOW

0

Low

HIGH

1

High

EVENTCHGTRICKLE

Writing 1 enables interrupts from EVENTCHGTRICKLE

W1S

C

RW

LOW

0

Low

HIGH

1

High

EVENTCHGCC

Writing 1 enables interrupts from EVENTCHGCC

W1S

D

RW

LOW

0

Low

HIGH

1

High

EVENTCHGCV

Writing 1 enables interrupts from EVENTCHGCV

W1S

E

RW

LOW

0

Low

HIGH

1

High

EVENTCHGCOMPLETED

Writing 1 enables interrupts from EVENTCHGCOMPLETED

W1S

F

RW

LOW

0

Low

HIGH

1

High

EVENTCHGERROR

Writing 1 enables interrupts from EVENTCHGERROR

W1S
LOW

0

Low

HIGH

1

High

##### 7.7.1.13 INTENEVENTSBCHARGER1CLR

Address offset: 0xD
Charger Interrupt Enable Clear

System features
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

ID

F E D C B A

Reset 0x00
ID

R/W Field

A

RW

Value ID

Value

Description

EVENTSUPPLEMENT

Writing 1 disables interrupts from EVENTSUPPLEMENT

W1C

B

RW

LOW

0

Low

HIGH

1

High

EVENTCHGTRICKLE

Writing 1 disables interrupts from EVENTCHGTRICKLE

W1C

C

RW

LOW

0

Low

HIGH

1

High

EVENTCHGCC

Writing 1 disables interrupts from EVENTCHGCC

W1C

D

RW

LOW

0

Low

HIGH

1

High

EVENTCHGCV

Writing 1 disables interrupts from EVENTCHGCV

W1C

E

RW

LOW

0

Low

HIGH

1

High

EVENTCHGCOMPLETED

Writing 1 disables interrupts from EVENTCHGCOMPLETED

W1C

F

RW

LOW

0

Low

HIGH

1

High

EVENTCHGERROR

Writing 1 disables interrupts from EVENTCHGERROR

W1C
LOW

0

Low

HIGH

1

High

##### 7.7.1.14 EVENTSBCHARGER2SET

Address offset: 0xE
Battery Event Set
Bit number

7

6 5 4 3 2 1 0

ID

C B A

Reset 0x00

0

ID

R/W Field

A

RW

Value ID

Value

0 0 0 0 0 0 0

Description

EVENTBATDETECTED

Reserved (Battery detected.) Writing 1 sets the event (for debugging).

W1S

B

RW

LOW

0

Low

HIGH

1

High

EVENTBATLOST

Battery lost. Writing 1 sets the event (for debugging).

W1S

C

RW

LOW

0

Low

HIGH

1

High

EVENTBATRECHARGE

Battery re-charge needed. Writing 1 sets the event (for debugging).

W1S
LOW

0

Low

HIGH

1

High

##### 7.7.1.15 EVENTSBCHARGER2CLR

Address offset: 0xF

System features
Battery Event Clear
Bit number

7

6 5 4 3 2 1 0

ID

C B A

Reset 0x00

0

ID

R/W Field

A

RW

Value ID

Value

EVENTBATDETECTED

Reserved (Battery detected.) Writing 1 clears the event (e.g. to acknowledge

W1C

B

RW

0 0 0 0 0 0 0

Description
an interrupt).

LOW

0

Low

HIGH

1

High

EVENTBATLOST

Battery lost. Writing 1 clears the event (e.g. to acknowledge an interrupt).

W1C

C

RW

LOW

0

Low

HIGH

1

High

EVENTBATRECHARGE

Battery re-charge needed. Writing 1 clears the event (e.g. to acknowledge

W1C

an interrupt).
LOW

0

Low

HIGH

1

High

##### 7.7.1.16 INTENEVENTSBCHARGER2SET

Address offset: 0x10
Battery Interrupt Enable Set
Bit number

7

6 5 4 3 2 1 0

ID

C B A

Reset 0x00

0

ID

R/W Field

A

RW

Value ID

Value

0 0 0 0 0 0 0

Description

EVENTBATDETECTED

Reserved (Writing 1 enables interrupts from EVENTBATDETECTED)

W1S

B

RW

LOW

0

Low

HIGH

1

High

EVENTBATLOST

Reserved (Writing 1 enables interrupts from EVENTBATLOST)

W1S

C

RW

LOW

0

Low

HIGH

1

High

EVENTBATRECHARGE

Writing 1 enables interrupts from EVENTBATRECHARGE

W1S
LOW

0

Low

HIGH

1

High

##### 7.7.1.17 INTENEVENTSBCHARGER2CLR

Address offset: 0x11
Battery Interrupt Enable Clear

System features
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

ID

C B A

Reset 0x00
ID

R/W Field

A

RW

Value ID

Value

Description

EVENTBATDETECTED

Reserved (Writing 1 disables interrupts from EVENTBATDETECTED)

W1C

B

RW

LOW

0

Low

HIGH

1

High

EVENTBATLOST

Reserved (Writing 1 disables interrupts from EVENTBATLOST)

W1C

C

RW

LOW

0

Low

HIGH

1

High

EVENTBATRECHARGE

Writing 1 disables interrupts from EVENTBATRECHARGE

W1C
LOW

0

Low

HIGH

1

High

##### 7.7.1.18 EVENTSSHPHLDSET

Address offset: 0x12
SHPHLD pin and watchdog Event Set
Bit number

7

ID

6 5 4 3 2 1 0
D C B A

Reset 0x00

0

ID

R/W Field

A

RW

Value ID

Value

0 0 0 0 0 0 0

Description

EVENTSHPHLDBTNPRESS

SHPHLD button is pressed. Writing 1 sets the event (for debugging).

W1S

B

RW

LOW

0

Low

HIGH

1

High

EVENTSHPHLDBTNRELEASE

SHPHLD button is released. Writing 1 sets the event (for debugging).

W1S

C

RW

LOW

0

Low

HIGH

1

High

EVENTSHPHLDEXIT

SHPHLD button held to exit Ship mode. Writing 1 sets the event (for

W1S

D

RW

debugging).
LOW

0

Low

HIGH

1

High

EVENTWATCHDOGWARN

Watchdog timeout warning. Writing 1 sets the event (for debugging).

W1S
LOW

0

Low

HIGH

1

High

##### 7.7.1.19 EVENTSSHPHLDCLR

Address offset: 0x13
SHPHLD pin and watchdog Event Clear

System features
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

ID

D C B A

Reset 0x00
ID

R/W Field

A

RW

Value ID

Value

Description

EVENTSHPHLDBTNPRESS

SHPHLD button is pressed. Writing 1 clears the event (e.g. to acknowledge

W1C

B

RW

an interrupt).
LOW

0

Low

HIGH

1

High

EVENTSHPHLDBTNRELEASE

SHPHLD button is released. Writing 1 clears the event (e.g. to acknowledge

W1C

C

RW

an interrupt).
LOW

0

Low

HIGH

1

High

EVENTSHPHLDEXIT

SHPHLD button held to exit Ship mode. Writing 1 clears the event (e.g. to

W1C

D

RW

acknowledge an interrupt).
LOW

0

Low

HIGH

1

High

EVENTWATCHDOGWARN

Watchdog timeout warning. Writing 1 clears the event (e.g. to acknowledge

W1C

an interrupt).
LOW

0

Low

HIGH

1

High

##### 7.7.1.20 INTENEVENTSSHPHLDSET

Address offset: 0x14
SHPHLD pin and watchdog Interrupt Enable Set
Bit number

7

6 5 4 3 2 1 0

ID

D C B A

Reset 0x00

0

ID

R/W Field

A

RW

Value ID

Value

0 0 0 0 0 0 0

Description

EVENTSHPHLDBTNPRESS

Writing 1 enables interrupts from EVENTSHPHLDBTNPRESS

W1S

B

RW

LOW

0

Low

HIGH

1

High

EVENTSHPHLDBTNRELEASE

Writing 1 enables interrupts from EVENTSHPHLDBTNRELEASE

W1S

C

RW

LOW

0

Low

HIGH

1

High

EVENTSHPHLDEXIT

Writing 1 enables interrupts from EVENTSHPHLDEXIT

W1S

D

RW

LOW

0

Low

HIGH

1

High

EVENTWATCHDOGWARN

Writing 1 enables interrupts from EVENTWATCHDOGWARN

W1S
LOW

0

Low

HIGH

1

High

##### 7.7.1.21 INTENEVENTSSHPHLDCLR

Address offset: 0x15
SHPHLD pin and watchdog Interrupt Enable Clear

System features
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

ID

D C B A

Reset 0x00
ID

R/W Field

A

RW

Value ID

Value

Description

EVENTSHPHLDBTNPRESS

Writing 1 disables interrupts from EVENTSHPHLDBTNPRESS

W1C

B

RW

LOW

0

Low

HIGH

1

High

EVENTSHPHLDBTNRELEASE

Writing 1 disables interrupts from EVENTSHPHLDBTNRELEASE

W1C

C

RW

LOW

0

Low

HIGH

1

High

EVENTSHPHLDEXIT

Writing 1 disables interrupts from EVENTSHPHLDEXIT

W1C

D

RW

LOW

0

Low

HIGH

1

High

EVENTWATCHDOGWARN

Writing 1 disables interrupts from EVENTWATCHDOGWARN

W1C
LOW

0

Low

HIGH

1

High

##### 7.7.1.22 EVENTSVBUSIN0SET

Address offset: 0x16
VBUS Event Set
Bit number

7

6 5 4 3 2 1 0

ID

F E D C B A

Reset 0x00

0

ID

R/W Field

A

RW

Value ID

Value

0 0 0 0 0 0 0

Description

EVENTVBUSDETECTED

VBUS detected. Writing 1 sets the event (for debugging).

W1S

B

RW

LOW

0

Low

HIGH

1

High

EVENTVBUSREMOVED

VBUS removed. Writing 1 sets the event (for debugging).

W1S

C

RW

LOW

0

Low

HIGH

1

High

EVENTVBUSOVRVOLTDETECTED

VBUS over voltage detected. Writing 1 sets the event (for debugging).

W1S

D

RW

LOW

0

Low

HIGH

1

High

EVENTVBUSOVRVOLTREMOVED

VBUS over voltage removed. Writing 1 sets the event (for debugging).

W1S

E

RW

LOW

0

Low

HIGH

1

High

EVENTVBUSUNDVOLTDETECTED

VBUS under voltage detected. Writing 1 sets the event (for debugging).

W1S

F

RW

LOW

0

Low

HIGH

1

High

EVENTVBUSUNDVOLTREMOVED

VBUS under voltage removed. Writing 1 sets the event (for debugging).

W1S
LOW

4548_062 v1.0

0

Low

System features
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

ID

F E D C B A

Reset 0x00
ID

R/W Field

Value ID

Value

Description

HIGH

1

High

##### 7.7.1.23 EVENTSVBUSIN0CLR

Address offset: 0x17
VBUS Event Clear
Bit number
ID

F E D C B A

Reset 0x00

0

ID

R/W Field

A

RW

Value ID

Value

EVENTVBUSDETECTED

VBUS detected. Writing 1 clears the event (e.g. to acknowledge an

W1C

B

RW

interrupt).
LOW

0

Low

HIGH

1

High

EVENTVBUSREMOVED

VBUS removed. Writing 1 clears the event (e.g. to acknowledge an

W1C

C

RW

interrupt).
LOW

0

Low

HIGH

1

High

EVENTVBUSOVRVOLTDETECTED

VBUS over voltage detected. Writing 1 clears the event (e.g. to acknowledge

W1C

D

RW

an interrupt).
LOW

0

Low

HIGH

1

High

EVENTVBUSOVRVOLTREMOVED

VBUS over voltage removed. Writing 1 clears the event (e.g. to acknowledge

W1C

E

RW

an interrupt).
LOW

0

Low

HIGH

1

High

EVENTVBUSUNDVOLTDETECTED

VBUS under voltage detected. Writing 1 clears the event (e.g. to

W1C

F

RW

0 0 0 0 0 0 0

Description

acknowledge an interrupt).
LOW

0

Low

HIGH

1

High

EVENTVBUSUNDVOLTREMOVED

VBUS under voltage removed. Writing 1 clears the event (e.g. to

W1C

acknowledge an interrupt).
LOW

0

Low

HIGH

1

High

##### 7.7.1.24 INTENEVENTSVBUSIN0SET

Address offset: 0x18
VBUS Interrupt Enable Set
Bit number

7

6 5 4 3 2 1 0

ID

F E D C B A

Reset 0x00

0

ID

R/W Field

A

RW

Value ID

Value

EVENTVBUSDETECTED

Writing 1 enables interrupts from EVENTVBUSDETECTED

W1S

4548_062 v1.0

0 0 0 0 0 0 0

Description

LOW

0

Low

HIGH

1

High

System features
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

ID

F E D C B A

Reset 0x00
ID

R/W Field

B

RW

Value ID

Value

Description

EVENTVBUSREMOVED

Writing 1 enables interrupts from EVENTVBUSREMOVED

W1S

C

RW

LOW

0

Low

HIGH

1

High

EVENTVBUSOVRVOLTDETECTED

Writing 1 enables interrupts from EVENTVBUSOVRVOLTDETECTED

W1S

D

RW

LOW

0

Low

HIGH

1

High

EVENTVBUSOVRVOLTREMOVED

Writing 1 enables interrupts from EVENTVBUSOVRVOLTREMOVED

W1S

E

RW

LOW

0

Low

HIGH

1

High

EVENTVBUSUNDVOLTDETECTED

Writing 1 enables interrupts from EVENTVBUSUNDVOLTDETECTED

W1S

F

RW

LOW

0

Low

HIGH

1

High

EVENTVBUSUNDVOLTREMOVED

Writing 1 enables interrupts from EVENTVBUSUNDVOLTREMOVED

W1S
LOW

0

Low

HIGH

1

High

##### 7.7.1.25 INTENEVENTSVBUSIN0CLR

Address offset: 0x19
VBUS Interrupt Enable Clear
Bit number

7

6 5 4 3 2 1 0

ID

F E D C B A

Reset 0x00

0

ID

R/W Field

A

RW

Value ID

Value

0 0 0 0 0 0 0

Description

EVENTVBUSDETECTED

Writing 1 disables interrupts from EVENTVBUSDETECTED

W1C

B

RW

LOW

0

Low

HIGH

1

High

EVENTVBUSREMOVED

Writing 1 disables interrupts from EVENTVBUSREMOVED

W1C

C

RW

LOW

0

Low

HIGH

1

High

EVENTVBUSOVRVOLTDETECTED

Writing 1 disables interrupts from EVENTVBUSOVRVOLTDETECTED

W1C

D

RW

LOW

0

Low

HIGH

1

High

EVENTVBUSOVRVOLTREMOVED

Writing 1 disables interrupts from EVENTVBUSOVRVOLTREMOVED

W1C

E

RW

LOW

0

Low

HIGH

1

High

EVENTVBUSUNDVOLTDETECTED

Writing 1 disables interrupts from EVENTVBUSUNDVOLTDETECTED

W1C
LOW

4548_062 v1.0

0

Low

System features
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

ID

F E D C B A

Reset 0x00
ID
F

R/W Field
RW

Value ID

Value

Description

HIGH

1

High

EVENTVBUSUNDVOLTREMOVED

Writing 1 disables interrupts from EVENTVBUSUNDVOLTREMOVED

W1C
LOW

0

Low

HIGH

1

High

##### 7.7.1.26 EVENTSVBUSIN1SET

Address offset: 0x1A
Thermal and charger detection Event Set
Bit number

7

ID

6 5 4 3 2 1 0
F E D C B A

Reset 0x00

0

ID

R/W Field

A

RW

Value ID

Value

0 0 0 0 0 0 0

Description

EVENTTHERMALWARNDETECTED

Thermal warning detected. Writing 1 sets the event (for debugging).

W1S

B

RW

LOW

0

Low

HIGH

1

High

EVENTTHERMALWARNREMOVED

Thermal warning removed. Writing 1 sets the event (for debugging).

W1S

C

RW

LOW

0

Low

HIGH

1

High

EVENTTHERMALSHUTDOWNDETECTED

Thermal shutown detected. Writing 1 sets the event (for debugging).

W1S

D

RW

LOW

0

Low

HIGH

1

High

EVENTTHERMALSHUTDOWNREMOVED

Thermal shutdown removed. Writing 1 sets the event (for debugging).

W1S

E

RW

LOW

0

Low

HIGH

1

High

EVENTCC1STATECHANGE

Voltage changed on pin CC1. Writing 1 sets the event (for debugging).

W1S

F

RW

LOW

0

Low

HIGH

1

High

EVENTCC2STATECHANGE

Voltage changed on pin CC2. Writing 1 sets the event (for debugging).

W1S
LOW

0

Low

HIGH

1

High

##### 7.7.1.27 EVENTSVBUSIN1CLR

Address offset: 0x1B
Thermal and charger detection Event Clear

System features
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

ID

F E D C B A

Reset 0x00
ID

R/W Field

A

RW

Value ID

Value

Description

EVENTTHERMALWARNDETECTED

Thermal warning detected. Writing 1 clears the event (e.g. to acknowledge

W1C

B

RW

an interrupt).
LOW

0

Low

HIGH

1

High

EVENTTHERMALWARNREMOVED

Thermal warning removed. Writing 1 clears the event (e.g. to acknowledge

W1C

C

RW

an interrupt).
LOW

0

Low

HIGH

1

High

EVENTTHERMALSHUTDOWNDETECTED

Thermal shutown detected. Writing 1 clears the event (e.g. to acknowledge

W1C

D

RW

an interrupt).
LOW

0

Low

HIGH

1

High

EVENTTHERMALSHUTDOWNREMOVED

Thermal shutdown removed. Writing 1 clears the event (e.g. to

W1C

E

RW

acknowledge an interrupt).
LOW

0

Low

HIGH

1

High

EVENTCC1STATECHANGE

Voltage changed on pin CC1. Writing 1 clears the event (e.g. to acknowledge

W1C

F

RW

an interrupt).
LOW

0

Low

HIGH

1

High

EVENTCC2STATECHANGE

Voltage changed on pin CC2. Writing 1 clears the event (e.g. to acknowledge

W1C

an interrupt).
LOW

0

Low

HIGH

1

High

##### 7.7.1.28 INTENEVENTSVBUSIN1SET

Address offset: 0x1C
Thermal and charger detection Interrupt Enable Set
Bit number

7

ID

6 5 4 3 2 1 0
F E D C B A

Reset 0x00

0

ID

R/W Field

A

RW

Value ID

Value

0 0 0 0 0 0 0

Description

EVENTTHERMALWARNDETECTED

Writing 1 enables interrupts from EVENTTHERMALWARNDETECTED

W1S

B

RW

LOW

0

Low

HIGH

1

High

EVENTTHERMALWARNREMOVED

Writing 1 enables interrupts from EVENTTHERMALWARNREMOVED

W1S

C

RW

LOW

0

Low

HIGH

1

High

EVENTTHERMALSHUTDOWNDETECTED

Writing 1 enables interrupts from EVENTTHERMALSHUTDOWNDETECTED

W1S

D

RW

LOW

0

Low

HIGH

1

High

EVENTTHERMALSHUTDOWNREMOVED

Writing 1 enables interrupts from EVENTTHERMALSHUTDOWNREMOVED

W1S
LOW

4548_062 v1.0

0

Low

System features
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

ID

F E D C B A

Reset 0x00
ID
E

R/W Field
RW

Value ID

Value

Description

HIGH

1

High

EVENTCC1STATECHANGE

Writing 1 enables interrupts from EVENTCC1STATECHANGE

W1S

F

RW

LOW

0

Low

HIGH

1

High

EVENTCC2STATECHANGE

Writing 1 enables interrupts from EVENTCC2STATECHANGE

W1S
LOW

0

Low

HIGH

1

High

##### 7.7.1.29 INTENEVENTSVBUSIN1CLR

Address offset: 0x1D
Thermal and charger detection Interrupt Enable Clear
Bit number

7

ID

6 5 4 3 2 1 0
F E D C B A

Reset 0x00

0

ID

R/W Field

A

RW

Value ID

Value

0 0 0 0 0 0 0

Description

EVENTTHERMALWARNDETECTED

Writing 1 disables interrupts from EVENTTHERMALWARNDETECTED

W1C

B

RW

LOW

0

Low

HIGH

1

High

EVENTTHERMALWARNREMOVED

Writing 1 disables interrupts from EVENTTHERMALWARNREMOVED

W1C

C

RW

LOW

0

Low

HIGH

1

High

EVENTTHERMALSHUTDOWNDETECTED

Writing 1 disables interrupts from EVENTTHERMALSHUTDOWNDETECTED

W1C

D

RW

LOW

0

Low

HIGH

1

High

EVENTTHERMALSHUTDOWNREMOVED

Writing 1 disables interrupts from EVENTTHERMALSHUTDOWNREMOVED

W1C

E

RW

LOW

0

Low

HIGH

1

High

EVENTCC1STATECHANGE

Writing 1 disables interrupts from EVENTCC1STATECHANGE

W1C

F

RW

LOW

0

Low

HIGH

1

High

EVENTCC2STATECHANGE

Writing 1 disables interrupts from EVENTCC2STATECHANGE

W1C
LOW

0

Low

HIGH

1

High

##### 7.7.1.30 EVENTSGPIOSET

Address offset: 0x22
GPIO Event Set

System features
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

ID

E D C B A

Reset 0x00
ID

R/W Field

A

RW

Value ID

Value

Description

EVENTGPIOEDGEDETECT0

Edge is detected on GPIO0. GPIOMODE = 3 : rising edge GPIOMODE = 4 :

W1S

B

RW

falling edge. Writing 1 sets the event (for debugging).
LOW

0

Low

HIGH

1

High

EVENTGPIOEDGEDETECT1

Edge is detected on GPIO1. GPIOMODE = 3 : rising edge GPIOMODE = 4 :

W1S

C

RW

falling edge. Writing 1 sets the event (for debugging).
LOW

0

Low

HIGH

1

High

EVENTGPIOEDGEDETECT2

Edge is detected on GPIO2. GPIOMODE = 3 : rising edge GPIOMODE = 4 :

W1S

D

RW

falling edge. Writing 1 sets the event (for debugging).
LOW

0

Low

HIGH

1

High

EVENTGPIOEDGEDETECT3

Edge is detected on GPIO3. GPIOMODE = 3 : rising edge GPIOMODE = 4 :

W1S

E

RW

falling edge. Writing 1 sets the event (for debugging).
LOW

0

Low

HIGH

1

High

EVENTGPIOEDGEDETECT4

Edge is detected on GPIO4. GPIOMODE = 3 : rising edge GPIOMODE = 4 :

W1S

falling edge. Writing 1 sets the event (for debugging).
LOW

0

Low

HIGH

1

High

##### 7.7.1.31 EVENTSGPIOCLR

Address offset: 0x23
GPIO Event Clear
Bit number

7

ID

E D C B A

Reset 0x00

0

ID

R/W Field

A

RW

Value ID

Value

RW

EVENTGPIOEDGEDETECT0

Edge is detected on GPIO0. GPIOMODE = 3 : rising edge GPIOMODE = 4 :
falling edge. Writing 1 clears the event (e.g. to acknowledge an interrupt).

LOW

0

Low

HIGH

1

High

EVENTGPIOEDGEDETECT1

Edge is detected on GPIO1. GPIOMODE = 3 : rising edge GPIOMODE = 4 :

W1C

C

RW

falling edge. Writing 1 clears the event (e.g. to acknowledge an interrupt).
LOW

0

Low

HIGH

1

High

EVENTGPIOEDGEDETECT2

Edge is detected on GPIO2. GPIOMODE = 3 : rising edge GPIOMODE = 4 :

W1C

D

RW

falling edge. Writing 1 clears the event (e.g. to acknowledge an interrupt).
LOW

0

Low

HIGH

1

High

EVENTGPIOEDGEDETECT3

Edge is detected on GPIO3. GPIOMODE = 3 : rising edge GPIOMODE = 4 :

W1C

E

RW

0 0 0 0 0 0 0

Description

W1C

B

6 5 4 3 2 1 0

falling edge. Writing 1 clears the event (e.g. to acknowledge an interrupt).
LOW

0

Low

HIGH

1

High

EVENTGPIOEDGEDETECT4

Edge is detected on GPIO4. GPIOMODE = 3 : rising edge GPIOMODE = 4 :

W1C

falling edge. Writing 1 clears the event (e.g. to acknowledge an interrupt).
LOW

4548_062 v1.0

0

Low

System features
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

ID

E D C B A

Reset 0x00
ID

R/W Field

Value ID

Value

Description

HIGH

1

High

##### 7.7.1.32 INTENEVENTSGPIOSET

Address offset: 0x24
GPIO Interrupt Enable Set
Bit number
ID

E D C B A

Reset 0x00

0

ID

R/W Field

A

RW

Value ID

Value

0 0 0 0 0 0 0

Description

EVENTGPIOEDGEDETECT0

Writing 1 enables interrupts from EVENTGPIOEDGEDETECT0

W1S

B

RW

LOW

0

Low

HIGH

1

High

EVENTGPIOEDGEDETECT1

Writing 1 enables interrupts from EVENTGPIOEDGEDETECT1

W1S

C

RW

LOW

0

Low

HIGH

1

High

EVENTGPIOEDGEDETECT2

Writing 1 enables interrupts from EVENTGPIOEDGEDETECT2

W1S

D

RW

LOW

0

Low

HIGH

1

High

EVENTGPIOEDGEDETECT3

Writing 1 enables interrupts from EVENTGPIOEDGEDETECT3

W1S

E

RW

LOW

0

Low

HIGH

1

High

EVENTGPIOEDGEDETECT4

Writing 1 enables interrupts from EVENTGPIOEDGEDETECT4

W1S
LOW

0

Low

HIGH

1

High

##### 7.7.1.33 INTENEVENTSGPIOCLR

Address offset: 0x25
GPIO Interrupt Enable Clear
Bit number

7

6 5 4 3 2 1 0

ID

E D C B A

Reset 0x00

0

ID

R/W Field

A

RW

Value ID

Value

0 0 0 0 0 0 0

Description

EVENTGPIOEDGEDETECT0

Writing 1 disables interrupts from EVENTGPIOEDGEDETECT0

W1C

B

RW

LOW

0

Low

HIGH

1

High

EVENTGPIOEDGEDETECT1

Writing 1 disables interrupts from EVENTGPIOEDGEDETECT1

W1C

4548_062 v1.0

LOW

0

Low

HIGH

1

High

System features
Bit number

7

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

ID

E D C B A

Reset 0x00
ID

R/W Field

C

RW

Value ID

Value

Description

EVENTGPIOEDGEDETECT2

Writing 1 disables interrupts from EVENTGPIOEDGEDETECT2

W1C

D

RW

LOW

0

Low

HIGH

1

High

EVENTGPIOEDGEDETECT3

Writing 1 disables interrupts from EVENTGPIOEDGEDETECT3

W1C

E

RW

LOW

0

Low

HIGH

1

High

EVENTGPIOEDGEDETECT4

Writing 1 disables interrupts from EVENTGPIOEDGEDETECT4

W1C
LOW

0

Low

HIGH

1

High

##### 7.7.1.34 REVISIONMSB

Address offset: 0x26
Revision MSB. See nPM1304 Compatibility Matrix for details.
Bit number

7

ID

A A A A A A A A

Reset 0x00

6 5 4 3 2 1 0

0

0 0 0 0 0 0 0

Bit number

7

6 5 4 3 2 1 0

ID

A A A A A A A A

ID

R/W Field

A

R

Value ID

Value

Description

REVMSB

Revision MSB

##### 7.7.1.35 REVISIONLSB

Address offset: 0x27
Revision LSB. See nPM1304 Compatibility Matrix for details.

Reset 0x00

0

ID

R/W Field

A

R

Value ID

Value

0 0 0 0 0 0 0

Description

REVLSB

Revision LSB

### 7.8 Reset and error registers

This section details the error and reset related registers.
Note: During the cooling period after a TSD and if VSYS drops below VSYSPOF, VSYSLOW could be
set instead of THERMALSHUTDOWN in register RSTCAUSE on page 146.

System features

#### 7.8.1 Registers

Instances
Instance

Base address

Description

ERRLOG

0x00000E00

Error Log registers
ERRLOG register map

Register overview
Register

Offset

Description

TASKCLRERRLOG

0x0

Task to clear the Errlog registers

SCRATCH0

0x1

Boot monitor control and scratch register 0

SCRATCH1

0x2

Scratch register 1

RSTCAUSE

0x3

Reset reasons. Cleared with TASKCLRERRLOG

CHARGERERRREASON

0x4

Error log for charger. Cleared with TASKCLRERRLOG

CHARGERERRSENSOR

0x5

Error log for charger. Cleared with TASKCLRERRLOG

##### 7.8.1.1 TASKCLRERRLOG

Address offset: 0x0
Task to clear the Errlog registers
Bit number

7

6 5 4 3 2 1 0

ID

A

Reset 0x00

0

ID

R/W Field

A

W

Value ID

Value

0 0 0 0 0 0 0

Description

TASKCLRERRLOG

Clear registers RSTCAUSE, CHARGERERRREASON and CHARGERERRSENSOR

##### 7.8.1.2 SCRATCH0

Address offset: 0x1
Boot monitor control and scratch register 0
Bit number

7

6 5 4 3 2 1 0

ID

B

B B B B B B A

Reset 0x00

0

0 0 0 0 0 0 0

ID

R/W Field

A

RW

B

RW

Value ID

Value

Description

NOBOOTMON

0

Boot monitor disable

BOOTMON

1

Boot monitor enable

BOOTTIMEREN

Enable boot monitor timer, only cleared by POR

SCRATCH0

Scratch register, only cleared by POR

##### 7.8.1.3 SCRATCH1

Address offset: 0x2
Scratch register 1

System features
Bit number

7

ID

A A A A A A A A

Reset 0x00

0

ID

R/W Field

A

RW

Value ID

Value

6 5 4 3 2 1 0

0 0 0 0 0 0 0

Description

SCRATCH1

Scratch register, only cleared by POR

##### 7.8.1.4 RSTCAUSE

Address offset: 0x3
Reset reasons. Cleared with TASKCLRERRLOG
Bit number

7

ID
Reset 0x00
ID

R/W Field

A

R

B

C

D

E

F

G

6 5 4 3 2 1 0
G F E D C B A

R

R

R

R

R

R

Value ID

Value

NORST

0

No reset

RST

1

Reset activated by Ship mode exit

0

0 0 0 0 0 0 0

7

6 5 4 3 2 1 0

Description

SHIPMODEEXIT

Reset caused by Ship mode exit

BOOTMONITORTIMEOUT

Reset caused by boot monitor timeout

NORST

0

No reset

RST

1

Reset activated by boot monitor

WATCHDOGTIMEOUT

Reset caused by watchdog timeout

NORST

0

No reset

RST

1

Reset activated by watchdog

NORST

0

No reset

RST

1

Long press reset

LONGPRESSTIMEOUT

Reset caused by long press reset

THERMALSHUTDOWN

Reset caused by thermal shutdown (TSD)

NORST

0

No reset

RST

1

Reset activated by TSD

VSYSLOW

Reset caused by power failure (POF)
NORST

0

No reset

RST

1

Reset activated by POF

NORST

0

No reset

RST

1

Reset activated by TASKSWRESET

SWRESET

Reset caused by TASKSWRESET

##### 7.8.1.5 CHARGERERRREASON

Address offset: 0x4
Error log for charger. Cleared with TASKCLRERRLOG
Bit number
ID

G F E D C B A

Reset 0x00

0

ID

R/W Field

A

R

NTCSENSORERR

NTC thermistor sensor error

B

R

VBATSENSORERR

VBAT sensor error

C

R

VBATLOW

VBAT low error

D

R

VTRICKLE

Vtrickle error

E

R

MEASTIMEOUT

Measurement timeout error

F

R

CHARGETIMEOUT

Charge timeout error

G

R

TRICKLETIMEOUT

Trickle timeout error

4548_062 v1.0

Value ID

Value

Description

146

0 0 0 0 0 0 0

System features

##### 7.8.1.6 CHARGERERRSENSOR

Address offset: 0x5
Error log for charger. Cleared with TASKCLRERRLOG
Bit number

7

ID

H G F E D C B A

Reset 0x00

0

ID

R/W Field

A

R

SENSORNTCCOLD

NTC cold region active when error occurs

B

R

SENSORNTCCOOL

NTC cool region active when error occurs

C

R

SENSORNTCWARM

NTC warm region active when error occurs

D

R

SENSORNTCHOT

NTC hot region active when error occurs

E

R

SENSORVTERM

Vterm status when error occurs

F

R

SENSORRECHARGE

Recharge status when error occurs

G

R

SENSORVTRICKLE

Vtrickle status when error occurs

H

R

SENSORVBATLOW

Vbatlow status when error occurs

4548_062 v1.0

Value ID

Value

Description

147

6 5 4 3 2 1 0

0 0 0 0 0 0 0

## 8 Application

The following application example uses nPM1304 and an nRF5x Bluetooth® Low Energy System on Chip
(SoC). For other configurations, see Reference circuitry on page 155.
The example application is for a design with the following configuration and features:
• •
• •
• •

BUCK, LOADSW, and LDO are in use
Host software controls the device through TWI, the interrupt on GPIO1, and RESET on the GPIO0 pin
Three LEDs available
Battery pack with NTC thermistor
Ship mode
Low battery indication LED

### 8.1 Schematic

VBUSIN

4

VBUS
VBUS
DDD+
D+
CC1
CC2
SBU1
SBU2
GND
GND

C14
1.0µF

C15
100nF

3

D1
VCC

GND

IO2

IO1

1
2

PRTR5V0U2X

USB-C 2.0
CC1
CC2

C1
1.0µF

VBAT
NTC
J1

LD1

L0603R

LD2

L0603G

LD3

L0603Y

R4

150k

47k

R3

19
18

U1
VBUS
CC1
CC2

VBUSOUT
VSYS
PVDD

VOUT1
BUCK1

RESET
INT
GPIO2
GPIO3
GPIO4

SW2

7
8
9
10
11

LED0
LED1
LED2

25
26
27

VSET1
VSET2

17
16

SHPHLD

15

SCL
SDA

14
13

12
C13
100nF

VBUSOUT

22
20
4

VSYS
C2
10µF
PVSS1

VBAT
NTC

C6
2.2µF
SW1

VSYS

21
23
24

LED0
LED1
LED2

SW1
PVSS1

VOUT2
SW2
PVSS2

SW1

L1
2.2µH

SW2

SCL
SDA

VOUTLDO1
LSOUT2

VDDIO

AVSS

Net tie

C8
10µF

PVSS2

VINLDO1
LSIN2

28
30
29
31

VDD
VDDH

C7
10µF

VOUT2
L2
2.2µH

VBUS
DD+

PVSS2

32
5
6

C5
1.0µF

VOUT1

VSET1
VSET2
SHPHLD

C4
10µF

1
3
2

U2
D_N
D_P

C3
10µF

PVSS1

GPIO0
GPIO1
GPIO2
GPIO3
GPIO4
BUCK2

Shield

J1

SCL
SDA
RESET
INT

P0.xx
P0.xx
P0.xx
P0.xx
P0.xx
P0.xx
P0.xx
P0.xx
VSS

Net tie

nRF5x

VSYS
VOUT2
VLDO
LSOUT

C9
10µF

C10
10µF

33

nPM1304-QEAA

*Figure 51: Application example*

### 8.2 Supplying from BUCK

An application must not be supplied directly from VBAT. This can interrupt the battery charging process
causing unwanted behavior from the charger. Use either VOUT1, VOUT2, or VSYS to supply the
application.
BUCK1 starts automatically and supplies the nRF5x host SoC with 1.8 V. BUCK1 is the I/O voltage for the
system. BUCK2 starts automatically with 3 V output voltage for other application features.

Application

### 8.3 USB port negotiation

nRF5x can connect to a USB host.
Port negotiation is performed after nPM1304 port detection. The nRF5x device and nPM1304 are both
connected to USB-C in the application example.
• The D+ and D- pins are connected to nRF5x. The CC1 and CC2 pins are connected to nPM1304. The
nRF5x SoC must wait until nPM1304 completes port detection using the USB configuration channel.
• The nRF5x device must set the correct current limit as described in Charge current limit (ICHG) on page
24.
• VBUS is supplied to SYSREG on nPM1304 and VBUSOUT supplies the nRF5x VBUS input.
VBUSOUT is only for host sensing and should not be used as a source.

### 8.4 Charging and error states

Three LEDs can be used for charging indicators or general purpose by the application.

### 8.5 Termination voltage and current

The termination voltage, VTERM, is configured through TWI up to 4.65 V.
Charge current is configured through TWI.

### 8.6 NTC thermistor configuration

The NTC pin connects to an external NTC thermistor. Place the NTC thermistor with thermal coupling on
the battery pack.

### 8.7 Ship mode

Ship mode is enabled at production time through the TWI interface.
SHPHLD is connected to SW2 and is in the circuit to exit Ship mode. If another circuit is present instead of
a button, any signal that is able to pull the SHPHLD pin low for the required period can be connected to
that net. See Ship and Hibernate modes on page 116 for more information.

## 9 Hardware and layout

### 9.1 Pin assignments

The pin assignment figures and tables describe the pinouts for the product variants of the chip.

#### 9.1.1 QFN32 pin assignments

The pin assignment figure and table describe the assignments for this variant of the chip.

*Figure 52: QFN32 pin assignments (top view)*

Hardware and layout
Pin
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32

Name

Function

Description

VOUT1

Power

BUCK1 output

Power

BUCK1 power ground

Power

BUCK1 regulator output to inductor

Power

BUCK[n] power input

Power

BUCK2 regulator output to inductor

Power

BUCK2 power ground

Digital I/O

GPIO0

Digital I/O

GPIO1

Digital I/O

GPIO2

Digital I/O

GPIO3

Digital I/O

GPIO4

Power

Supply for TWI and GPIOs

Digital I/O

TWI data

Digital input

TWI clock

Digital input

Ship mode hold

Analog input

Voltage set for BUCK2 to resistor

Analog input

Voltage set for BUCK1 to resistor

Analog input

Battery thermistor

Power

Battery

Power

System voltage output

Power

Input supply

Analog output

VBUS output for host

Analog input

USB Type-C configuration channel 1

Analog input

USB Type-C configuration channel 2

Analog output

LEDDRV0 output

Analog output

LEDDRV1 output

Analog output

LEDDRV2 output

Power

LOADSW1 supply or LDO1 input

PVSS1
SW1

PVDD
SW2

PVSS2
GPIO0
GPIO1
GPIO2
GPIO3
GPIO4
VDDIO
SDA
SCL

SHPHLD
VSET2
VSET1
NTC

VBAT
VSYS
VBUS

VBUSOUT
CC1
CC2

LED0
LED1
LED2

LSIN1/VINLDO1

LSOUT1/VOUTLDO1 Power
LSIN2/VINLDO2

LOADSW1 or LDO1 output

Power

LOADSW2 supply or LDO2 input

LSOUT2/VOUTLDO2 Power
VOUT2

Exposed pad AVSS

LOADSW2 or LDO2 output

Power

BUCK2 output

Power

Ground

*Table 32: QFN32 pin assignments*

Hardware and layout

#### 9.1.2 CSP ball assignments

The ball assignment figure and table describe the ball assignments for this variant of the chip.

*Figure 53: CSP ball assignment (top view)*

Hardware and layout
Ball

Name

Function

Description

A1

LED0

Analog output

LEDDRV0 output

A2

LED1

Analog output

LEDDRV1 output

A3

LED2

Analog output

LEDDRV2 output

A4

LSOUT1/VOUTLDO1

Power

LOADSW1 or LDO1 output

A5

LSOUT2/VOUTLDO2

Power

LOADSW2 or LDO2 output

A6

AVSS

Power

Ground

A7

PVSS1

Power

BUCK1 power ground

B1, B2

VBUS

Power

Input supply

B3

CC2

Analog input

USB Type-C configuration channel 2

B4

LSIN1/VINLDO1

Power

LOADSW1 supply or LDO1 input

B5

LSIN2/VINLDO2

Power

LOADSW2 supply or LDO2 input

B6

VOUT1

Power

BUCK1 output

B7

SW1

Power

BUCK1 regulator output to inductor

C1, C2

VSYS

Power

System voltage output

C3

VBUSOUT

Analog output

VBUS output for host

C4

GPIO3

Digital I/O

GPIO3

C5

GPIO2

Digital I/O

GPIO2

C6

VOUT2

Power

BUCK2 output

C7

PVDD

Power

Power input for BUCK[n]

D1, D2

VBAT

Power

Battery

D3

NTC

Analog input

Battery thermistor

D4

SHPHLD

Digital input

Ship mode hold

D5

CC1

Analog input

USB Type-C configuration channel 1

D6

GPIO0

Digital I/O

GPIO0

D7

SW2

Power

BUCK2 regulator output to inductor

E1

VSET2

Analog input

Voltage set for BUCK2 to resistor

E2

VSET1

Analog input

Voltage set for BUCK1 to resistor

E3

SCL

Digital input

TWI clock

E4

VDDIO

Power

Supply for TWI and GPIOs

E5

SDA

Digital I/O

TWI data

E6

GPIO1

Digital I/O

GPIO1

E7

PVSS2

Power

BUCK2 power ground

*Table 33: Pin descriptions*

Hardware and layout

### 9.2 Mechanical specifications

The mechanical specifications for the packages show the dimensions.

#### 9.2.1 QFN32 package

*Figure 54: QFN32 5.0x5.0 mm package*

A

A1

A2

Min.

0.8

0

Nom.

0.85

0.035

Max.

0.9

0.05

A3

0.65

0.08

A4

b

0.203

D, E

D2, E2 e

0.2

4.9

3.4

0.25

5

3.5

0.3

5.1

3.6

*Table 34: QFN32 dimensions in millimeters*

#### 9.2.2 CSP package

4548_062 v1.0

154

K

L
0.3

0.5

0.35

0.4
0.45

Hardware and layout

*Figure 55: CSP 2.3775x3.0775 mm package*

A
Min.

A1

A2

A3

0.416 0.14 0.254

Nom. 0.464
Max. 0.512

0.2

A5

D

D2

0.022 3.0475

d

E

E2

e

F

G

2.3475

0.269 0.05

0.025 3.0775 2.514 0.419 2.3775 1.76

0.284

0.028 3.1075

2.4075

b
0.195

0.44 0.88

1.257
0.255

*Table 35: CSP dimensions in millimeters*

### 9.3 Reference circuitry

Documentation for the different package reference circuits, including Altium Designer files, PCB layout
files, and PCB production files, can be downloaded from www.nordicsemi.com.
The following reference circuits for nPM1304 show the schematics and components to support different
configurations in a design.

Hardware and layout
Configuration 1

Configuration 2

Configuration 3

Description

Full configuration

Simple configuration

Minimal configuration

BUCKs

Both configured

One configured

Not used

LOADSWs

Both configured, LDO
mode

One configured, load
switch mode

Not used

Ship mode exit

Configured

Configured

Not used

Charging

Available

Available

Available

Battery thermistor

Configured

Configured

Not used

LEDs

Three available

One available

Not used

GPIOs

Configured

Configured

Configured

TWI

Configured

Configured

Configured

VSET1

47 kΩ

47 kΩ

Not used

150 kΩ

Not used

Not used

1.8 V

1.8 V

Not used

3.0 V

Not used

Not used

Configured

Configured

Not used

Configured

Configured

Configured

VSET2
VOUT1
VOUT2

VBUSOUT
VDDIO

*Table 36: PCB application configuration*

#### 9.3.1 Configuration 1

21
23
24

CC1
CC2

C1
1.0µF

VBAT

19
18

NTC
J1
Battery pack

GPIO0
GPIO1
GPIO2
GPIO3
GPIO4

VSYS

R

G

B

LD1

R4

47k

R3

150k

Optional LEDs

7
8
9
10
11

LED0
LED1
LED2

25
26
27

VSET1
VSET2

17
16

SHPHLD

15

C13
100nF

R1

R2

10k

VDDIO

14
13
10k

SCL
SDA

Optional TWI
pull-up resistors

VBUS
CC1
CC2

VBUSOUT
VSYS
PVDD

12

VSYS
C2
10µF

VOUT1

GPIO0
GPIO1
GPIO2
GPIO3
GPIO4

SW1
PVSS1

VOUT2

LED0
LED1
LED2

SW2
PVSS2

3
2

SW1

L1
2.2µH

SCL
SDA

LSIN1/VINLDO1
LSIN2/VINLDO2
LSOUT1/VOUTLDO1
LSOUT2/VOUTLDO2

VDDIO

AVSS

28
30
29
31
33

nPM1304-QEAA

156

C5
1.0µF

C7
10µF
Net tie
PVSS1
Via to GND-layer on PVSS1
VOUT2

SW2

L2
2.2µH

C8
10µF
Net tie
PVSS2
Via to GND-layer on PVSS2

VSET1
VSET2
SHPHLD

C4
10µF

PVSS2

32
5
6

C3
10µF

VOUT1

1

*Figure 56: QFN schematic*

4548_062 v1.0

VBUSOUT

22
20
4

PVSS1
VBAT
NTC
BUCK1

C6
2.2µF

U1

BUCK2

VBUSIN

VINLDO1

VOUTLDO1

C9
10µF

C10
10µF

VINLDO2
VOUTLDO2

C11
10µF

C12
10µF

Hardware and layout
VBUSIN
C1
1.0µF

CC1
CC2

B1
B2
D5
B3

NTC

D1
D2
D3

VBAT

J1
Battery pack

GPIO0
GPIO1
GPIO2
GPIO3

VSYS

G

B

150k

47k

R4

D6
E6
C5
C4

LED0
LED1
LED2

A1
A2
A3

VSET1
VSET2

E2
E1

SHPHLD

D4

C13
100nF

R1

R2

10k

VDDIO

E3
E5
10k

SCL
SDA

Optional TWI
pull-up resistors

E4

VBUSOUT

C3
C1
C2
C7

VSYS
C2
10µF
PVSS1

VBAT
VBAT
NTC

VOUT1

GPIO0
GPIO1
GPIO2
GPIO3

SW1
PVSS1

C4
10µF

C5
1.0µF

PVSS2
VOUT1

B6
B7
A7

C3
10µF

SW1

L1
2.2µH

C7
10µF
Net tie
PVSS1
Via to GND-layer on PVSS1
VOUT2

VOUT2

LD1

Optional LEDs

R3

VBUSOUT
VSYS
VSYS
PVDD

BUCK2

R

VBUS
VBUS
CC1
CC2

BUCK1

C6
2.2µF

U1

LED0
LED1
LED2

SW2
PVSS2

C6
D7
E7

SW2

L2
2.2µH

C8
10µF
Net tie
PVSS2
Via to GND-layer on PVSS2

VSET1
VSET2
SHPHLD

SCL
SDA

LSIN1/VINLDO1
LSIN2/VINLDO2
LSOUT1/VOUTLDO1
LSOUT2/VOUTLDO2

VDDIO

AVSS

B4
B5
A4
A5
A6

VINLDO1

VOUTLDO1

C9
10µF

C10
10µF

VINLDO2
VOUTLDO2

C11
10µF

C12
10µF

nPM1304-CAAA

*Figure 57: CSP schematic*

Designator

Value

Description

Package

C1

1.0 μF

Capacitor, X5R, 25 V, ±10%

0603

C5

1.0 μF

Capacitor, X5R, 10 V, ±10%

0603

C2, C3, C4, C7, C8,
C9, C10, C11, C12

10 μF

Capacitor, X5R, 16 V, ±20%

0603

C6

2.2 μF

Capacitor, X5R, 10 V, ±10%

0603

C13

100 nF

Capacitor, X5R

0201

L1, L2

2.2 μH

Inductor, DCR < 400 mΩ, ±20%

0806

R1, R2

Dependent on bus speed
and parasitic capacitances

Optional pull-up resistors for TWI 0201

R3, R4

See Output voltage selection Resistors for setting the BUCK1
0201
on page 43
and BUCK2 output voltages, ±5%

U1

nPM1304

nPM1304

*Table 37: Bill of material*

#### 9.3.2 Configuration 2

4548_062 v1.0

157

QFN32 or CSP35

Hardware and layout

21
23
24

CC1
CC2

C1
1.0µF

VBAT

19
18

NTC
J1
Battery pack

VSYS
LD1
L0603G

GPIO0
GPIO1
GPIO2
GPIO3
GPIO4

7
8
9
10
11

LED0

25
26
27

R3

47k

Optional LED
VSET1

17
16

SHPHLD

15

R1

VDDIO
C13
100nF

R2

10k

14
13
10k

SCL
SDA

VBUS
CC1
CC2

VBUSOUT
VSYS
PVDD

12

Optional TWI
pull-up resistors

VBUSOUT

22
20
4

VSYS
C2
10µF

C4
10µF

C5
1.0µF

PVSS1
VBAT
NTC

VOUT1
BUCK1

C6
2.2µF

U1

GPIO0
GPIO1
GPIO2
GPIO3
GPIO4

SW1
PVSS1

VOUT2
BUCK2

VBUSIN

LED0
LED1
LED2

SW2
PVSS2

VOUT1

1
3
2

32

SW1

L1
2.2µH

C7
10µF

Net tie
PVSS1
Via to GND-layer on PVSS1
VSYS

5
6

VSET1
VSET2
SHPHLD

LSIN1/VINLDO1
LSIN2/VINLDO2

SCL
SDA

LSOUT1/VOUTLDO1
LSOUT2/VOUTLDO2

VDDIO

AVSS

VOUT1

28
30
29
31

LSOUT1
C14
1.0µF

33

nPM1304-QEAA

*Figure 58: QFN schematic*

C1
1.0µF

CC1
CC2

B1
B2
D5
B3

NTC

D1
D2
D3

VBAT

J1
Battery pack

GPIO0
GPIO1
GPIO2
GPIO3

VSYS
LD1
L0603G

D6
E6
C5
C4

LED0

A1
A2
A3

R3

47k

Optional LED
VSET1

E2
E1

SHPHLD

D4

C13
100nF

R1

R2

10k

VDDIO

E3
E5
10k

SCL
SDA

Optional TWI
pull-up resistors

VBUS
VBUS
CC1
CC2

VBUSOUT
VSYS
VSYS
PVDD

E4

VOUT1

GPIO0
GPIO1
GPIO2
GPIO3

SW1
PVSS1

VOUT2

LED0
LED1
LED2

SW2
PVSS2

VSYS
C2
10µF

C4
10µF

C5
1.0µF

VOUT1

B6
B7
A7

C6

SW1

L1
2.2µH

C7
10µF

Net tie
PVSS1
Via to GND-layer on PVSS1
VSYS

D7
E7

VSET1
VSET2
SHPHLD

LSIN1/VINLDO1
LSIN2/VINLDO2

SCL
SDA

LSOUT1/VOUTLDO1
LSOUT2/VOUTLDO2

VDDIO

AVSS

nPM1304-CAAA

*Figure 59: CSP schematic*

4548_062 v1.0

VBUSOUT

C3
C1
C2
C7

PVSS1

VBAT
VBAT
NTC
BUCK1

C6
2.2µF

U1

BUCK2

VBUSIN

158

B4
B5
A4
A5
A6

VOUT1

LSOUT1
C14
1.0µF

Hardware and layout
Designator

Value

Description

Package

C1

1.0 μF

Capacitor, X5R, 25 V, ±10%

0603

C5, C14

1.0 μF

Capacitor, X5R, 10 V, ±10%

0603

C2, C4, C7

10 μF

Capacitor, X5R, 16 V, ±20%

0603

C6

2.2 μF

Capacitor, X5R, 10 V, ±10%

0603

C13

100 nF

Capacitor, X5R

0201

L1

2.2 μH

Inductor, DCR < 400 mΩ, ±20%

0806

R1, R2

Dependent on bus speed
and parasitic capacitances

Optional pull-up resistors for TWI 0201

R3

See Output voltage selection Resistor for setting the BUCK1
on page 43
output voltage, ±5%

0201

U1

nPM1304

QFN32 or CSP35

nPM1304

*Table 38: Bill of material*

#### 9.3.3 Configuration 3

VBUSIN

21
23
24

CC1
CC2

C1
1.0µF

VBAT

19
18

J1

C6
2.2µF

VBUSOUT
VSYS
PVDD

VBAT
NTC

VOUT1
BUCK1

17
16
15

R1

R2

10k

14
13
10k

SCL
SDA

Optional TWI
pull-up resistors

12

GPIO0
GPIO1
GPIO2
GPIO3
GPIO4

SW1
PVSS1

VOUT2
BUCK2

7
8
9
10
11
25
26
27

C13
100nF

VBUS
CC1
CC2

Battery pack

GPIO0
GPIO1
GPIO2
GPIO3
GPIO4

VDDIO

U1

LED0
LED1
LED2

SW2
PVSS2

SHPHLD

LSIN1/VINLDO1
LSIN2/VINLDO2

SCL
SDA

LSOUT1/VOUTLDO1
LSOUT2/VOUTLDO2

VDDIO

AVSS

nPM1304-QEAA

159

VSYS
C4
10µF

1
3
2

32
5
6

VSET1
VSET2

*Figure 60: QFN schematic*

4548_062 v1.0

22
20
4

28
30
29
31
33

C5
1.0µF

Hardware and layout
VBUSIN
C1
1.0µF

B1
B2
D5
B3

CC1
CC2

VBAT

D1
D2
D3

J1

C6
2.2µF

U1
VBUS
VBUS
CC1
CC2

VBUSOUT
VSYS
VSYS
PVDD

VBAT
VBAT
NTC

VOUT1

D6
E6
C5
C4
A1
A2
A3
E2
E1
D4

R1

VDDIO
C13
100nF

R2

10k

E3
E5
10k

SCL
SDA

E4

Optional TWI
pull-up resistors

GPIO0
GPIO1
GPIO2
GPIO3

SW1
PVSS1

VOUT2
BUCK2

GPIO0
GPIO1
GPIO2
GPIO3

BUCK1

Battery pack

LED0
LED1
LED2

SW2
PVSS2

C3
C1
C2
C7

VSYS
C4
10µF

C5
1.0µF

B6
B7
A7

C6
D7
E7

VSET1
VSET2
SHPHLD

LSIN1/VINLDO1
LSIN2/VINLDO2

SCL
SDA

LSOUT1/VOUTLDO1
LSOUT2/VOUTLDO2

VDDIO

AVSS

B4
B5
A4
A5
A6

nPM1304-CAAA

*Figure 61: CSP schematic*

Designator

Value

Description

Package

C1

1.0 μF

Capacitor, X5R, 25 V, ±10%

0603

C5

1.0 μF

Capacitor, X5R, 10 V, ±10%

0603

C4

10 μF

Capacitor, X5R, 10 V, ±20%

0603

C6

2.2 μF

Capacitor, X5R, 10 V, ±10%

0603

C13

100 nF

Capacitor, X5R

0201

R1, R2

Dependent on bus speed
and parasitic capacitances

Optional pull-up resistors for TWI 0201

U1

nPM1304

nPM1304

QFN32 or CSP35

*Table 39: Bill of material*

#### 9.3.4 PCB guidelines

A well designed PCB is necessary to achieve good performance. A poor layout can lead to loss in
performance or functionality.
To ensure functionality, it is essential to follow the schematics and layout references closely.
A PCB with a minimum of two layers, including a ground plane, is recommended for optimal performance.
The BUCK supply voltage should be decoupled with high performance capacitors as close as possible to
the supply pins.
Long power supply lines on the PCB should be avoided. All device grounds, VDD connections, and VDD
bypass capacitors must be connected as close as possible to the device.

#### 9.3.5 PCB layout example

The PCB layouts for configuration 1 are shown here for QFN followed by CSP.

Hardware and layout

QFN PCB layout
For all available reference layouts, see the Reference Layout section on the Downloads tab for nPM1304
on www.nordicsemi.com.

*Figure 62: Top silkscreen layer QFN*

*Figure 63: Top layer QFN*

*Figure 64: Mid layer 1 QFN*

*Figure 65: Mid layer 2 QFN*

Hardware and layout

*Figure 66: Bottom layer QFN*

Note: No components on the bottom layer.

CSP PCB layout

*Figure 67: Top silkscreen layer CSP*

*Figure 68: Top layer CSP*

*Figure 69: Mid layer 1 CSP*

Hardware and layout

*Figure 70: Mid layer 2 CSP*

*Figure 71: Mid layer 3 CSP*

*Figure 72: Mid layer 4 CSP*

*Figure 73: Bottom layer CSP*

Note: No components are on the bottom layer.

## 10 Ordering information

This chapter contains information on IC marking, ordering codes, and container sizes.

### 10.1 IC marking

The nPM1304 PMIC package is marked as shown in the following figure.

N

P

M

1

3

<P

P>

<V

V>

<H> <P>

<Y

Y>

<W

W>

<L

0

4

L>

*Figure 74: IC marking*

### 10.2 Box labels

The following figures define the box labels used for nPM1304.
PART NO.: (1P) <NORDIC DEVICE ORDER CODE>
TRACE CODE: (1T) <YYWWLL1/YYWWLL2/...YYWWLLn>
TRACE CODE QUANTITY: <Qty1/Qty2...Qtyn>
TOTAL QUANTITY: (Q) <Total inner box qty>
BOX ID: <SUPPLIER-GEN. ID> SEAL DATE: <yyyy-mm-dd>

*Figure 75: Inner box label*

4548_062 v1.0

164

Pb

e3

<HPF>

Ordering information

FROM:

TO:

PART NO.: (1P) <NORDIC DEVICE ORDER CODE>

<HPF>

CUSTOMER PO NO: (K) <CUSTOMER P.O. NO>

Pb

SALES ORDER NO: (14K) <Nordic sales order+Sales order line no.+
Delivery line no.>

SHIPMENT ID: (2K) <Nordic’s shipment ID>

QUANTITY: (Q) <Total Quantity>
<COO

COUNTRY OF ORIGIN: (4L) 2-char. CARTON NO.
Code>
x/n
DELIVERY NO: (9K) <Shipper’s

GROSS WEIGHT

shipment no.>

KGS

*Figure 76: Outer box label*

### 10.3 Order code

The following tables define nPM1304 order codes and definitions.

n

P

M

1

3

0

4

-

<P

*Figure 77: Order code*

4548_062 v1.0

165

P>

<V

V>

-

<C

C>

Ordering information
Abbreviation

Definition and implemented codes

nPM13

nPM13 series product

04

Part code

<PP>

Package variant code

<VV>

Function variant code

<H><P><F>

Build code
H - Hardware version code
P - Production configuration code (production site, etc.)
F - Firmware version code (only visible on shipping container label)

<YY><WW><LL>

Tracking code
YY - Year code
WW - Assembly week number
LL - Wafer lot code

<CC>

Container code

eX

2nd level Interconnect Symbol where value of X is based on J-STD-609

*Table 40: Abbreviations*

### 10.4 Code ranges and values

The following tables define nPM1304 code ranges and values.
<PP>

Package
CA

Size (mm)

CSP

Pin/Ball count

3.1x2.4

Pitch (mm)

35

0.419
0.440

QE

QFN

5.0x5.0

32

0.5

*Table 41: Package variant codes*

<VV>

Flash (kB)
AA

RAM (kB)
n/a

*Table 42: Function variant codes*

<H>

Description
[A . . Z]

Hardware version/revision identifier (incremental)

*Table 43: Hardware version codes*

4548_062 v1.0

166

n/a

Ordering information
<P>

Description
[0 . . 9]

Production device identifier (incremental)

[A . . Z]

Engineering device identifier (incremental)

*Table 44: Production configuration codes*

<F>

Description

[A . . N, P . . Z]

Version of preprogrammed firmware

[0]

Delivered without preprogrammed firmware

*Table 45: Production version codes*

<YY>

Description

[16 . . 99]

Production year: 2016 to 2099

*Table 46: Year codes*

<WW>

Description

[1 . . 52]

Week of production

*Table 47: Week codes*

<LL>

Description

[AA . . ZZ]

Wafer production lot identifier

*Table 48: Lot codes*

<CC>

Description
R7

7" Reel

R

13" Reel

*Table 49: Container codes*

### 10.5 Product options

The following tables define nPM1304 product options.

Ordering information
Order code

Package

MOQ1

nPM1304-QEAA-R

4000 pcs

QFN

nPM1304-QEAA-R7

1500 pcs

QFN

nPM1304-CAAA-R

7000 pcs

CSP

nPM1304-CAAA-R7

1500 pcs

CSP

*Table 50: nPM1304 order codes*

Order code

Description

nPM1304-EK

Evaluation kit

*Table 51: Evaluation tools order code*

1

Minimum Ordering Quantity

## 11 Legal notices

By using this documentation you agree to our terms and conditions of use. Nordic Semiconductor may
change these terms and conditions at any time without notice.

Liability disclaimer
Nordic Semiconductor ASA reserves the right to make changes without further notice to the product to
improve reliability, function, or design. Nordic Semiconductor ASA does not assume any liability arising out
of the application or use of any product or circuits described herein.
Nordic Semiconductor ASA does not give any representations or warranties, expressed or implied, as to
the accuracy or completeness of such information and shall have no liability for the consequences of use
of such information. If there are any discrepancies, ambiguities or conflicts in Nordic Semiconductor’s
documentation, the Datasheet prevails.
Nordic Semiconductor ASA reserves the right to make corrections, enhancements, and other changes to
this document without notice.
Customer represents that, with respect to its applications, it has all the necessary expertise to create
and implement safeguards that anticipate dangerous consequences of failures, monitor failures and
their consequences, and lessen the likelihood of failures that might cause harm, and to take appropriate
remedial actions.
Nordic Semiconductor ASA assumes no liability for applications assistance or the design of customers’
products. Customers are solely responsible for the design, validation, and testing of its applications as well
as for compliance with all legal, regulatory, and safety-related requirements concerning its applications.
Nordic Semiconductor ASA’s products are not designed for use in life-critical medical equipment,
support appliances, devices, or systems where malfunction of Nordic Semiconductor ASA’s products can
reasonably be expected to result in personal injury. Customer may not use any Nordic Semiconductor
ASA’s products in life-critical medical equipment unless adequate design and operating safeguards by
customer’s authorized officers have been made. Customer agrees that prior to using or distributing
any life-critical medical equipment that include Nordic Semiconductor ASA’s products, customer will
thoroughly test such systems and the functionality of such products as used in such systems.
Customer will fully indemnify Nordic Semiconductor ASA and its representatives against any damages,
costs, losses, and/or liabilities arising out of customer’s non-compliance with this section.

RoHS and REACH statement
Refer to for complete hazardous substance reports, material composition reports, and latest version of
Nordic’s RoHS and REACH statements.

Trademarks
All trademarks, service marks, trade names, product names, and logos appearing in this documentation
are the property of their respective owners.

Copyright notice
© 2026 Nordic Semiconductor ASA. All rights are reserved. Reproduction in whole or in part is prohibited

without the prior written permission of the copyright holder.

Legal notices
