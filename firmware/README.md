# SatNOGS Rotator Firmware

Firmware [SatNOGS Rotator Controller](https://gitlab.com/librespacefoundation/satnogs/satnogs-rotator-firmware).

Repository includes all source files for the SatNOGS rotator controller Firmware.

Electronics can be found on [satnogs-rotator-controller](https://gitlab.com/librespacefoundation/satnogs/satnogs-rotator-controller)

## Instructions

In order to use this code, you need to install
 * [AccelStepper library](http://www.airspayce.com/mikem/arduino/AccelStepper/index.html)
 * [PID_v1 library](https://github.com/br3ttb/Arduino-PID-Library)
 * Wire library

You need to choose the version of the Firmware you will be utilizing based on your controller and rotator setup. Namely we have two different versions (one for DC motors and one for Stepper motors).

##### Steps

* Download arduino IDE (tested with 1.8.5)
* Add these lines in /arduino-1.8.5/hardware/arduino/avr/boards.txt

```
##############################################################
satnogs.name=SatNOGS
satnogs.upload.tool=avrdude
satnogs.upload.protocol=buspirate
satnogs.upload.maximum_size=32256
satnogs.upload.maximum_data_size=2048
satnogs.upload.speed=115200

satnogs.bootloader.tool=avrdude
satnogs.bootloader.low_fuses=0xFF
satnogs.bootloader.high_fuses=0xDE
satnogs.bootloader.extended_fuses=0xFD
satnogs.bootloader.unlock_bits=0x3F
satnogs.bootloader.lock_bits=0x0F
satnogs.bootloader.file=optiboot/optiboot_atmega328.hex

satnogs.build.mcu=atmega328p
satnogs.build.f_cpu=16000000L
satnogs.build.board=AVR_SATNOGS
satnogs.build.core=arduino
satnogs.build.variant=eightanaloginputs
##############################################################
```

* Install [Arduino-Makefile](https://github.com/sudar/Arduino-Makefile)

```
ARDUINO_DIR – Directory where Arduino is installed
ARDMK_DIR – Directory where you have copied the makefile
AVR_TOOLS_DIR – Directory where avr tools are installed
USER_LIB_PATH – Directory where arduino libraries are installed
AVRDUDE – Directory where avrdude are installed
AVRDUDE_ARD_BAUDRATE – Serial Baudrate (uncomment to use 57600 for FTDI)
include – Directory where Arduino.mk are installed
```

* Build the code

```
make
```

* Upload using ISP

    * Connect [arduino](https://www.arduino.cc/en/Tutorial/ArduinoISP) or buspirate for ISP programming

        1. Pin 13 (SCK) to Pin 13 - PB5 of arduino pro mini, ISP connector
        2. Pin 12 (MISO) to Pin 12 - PB4 of arduino pro mini, ISP connector
        3. Pin 11 (MOSI) to Pin 11 of arduino pro mini, ISP connector
        4. Pin 10 (RESET) to Pin RST of arduino pro mini, ISP connector
        5. 5+ (Vcc) to Pin VCC of arduino pro mini, ISP connector
        6. Gnd (Gnd) to Pin GND of arduino pro mini, ISP connector

* BusPirate

```
satnogs.upload.protocol=buspirate (in board.txt)
ISP_PROG = buspirate (in Makefile)
```
```
make ispload
```

* [Arduino](https://www.arduino.cc/en/Tutorial/ArduinoISP)

```
satnogs.upload.protocol=arduino (in board.txt)
ISP_PROG = arduino (in Makefile)
```

```
make ispload
```

* Upload using FDTI, but is necessary to uninstall arduino pro-mini from board

Connect [FTDI](https://learn.sparkfun.com/tutorials/using-the-arduino-pro-mini-33v)

```
satnogs.upload.protocol=arduino (in board.txt)
```
```
make upload
```
* Burn optiboot

Only with ISP programming

    * Arduino as ISP
    * BusPirate as ISP

```
make burn_bootloader
```

## Easycomm implemantation

* AZ, Azimuth, number - 1 decimal place [deg]
* EL, Elevation, number - 1 decimal place [deg]
* SA, Stop azimuth moving
* SE, Stop elevation moving
* RESET, Move to home position
* PARK, Move to park position
* IP, Read an input, number
    * Temperature = 0
    * SW1 = 1
    * SW2 = 2
    * Encoder1 = 3
    * Encoder2 = 4
    * Load of M1/AZ = 5
    * Load of M2/EL = 6
    * Speed of M1/AZ (DPS) = 7
    * Speed of M2/EL (DPS) = 8
* VE, Request Version
* GS, Get status register, number
    * idle = 1
    * moving = 2
    * pointing = 4
    * error = 8
* GE, Get error register, number
    * no_error = 1
    * sensor_error = 2
    * homing_error = 4
    * motor_error = 8
    * over_temperature = 12
    * wdt_error = 16
* VL, Velocity Left ,number [mdeg/s]
* VR, Velocity Right, number [mdeg/s]
* VU, Velocity Up, number [mdeg/s]
* VD, Velocity Down, number [mdeg/s]
* CR, Read config, register [0-x]
    * Gain P for M1/AZ = 1
    * Gain I for M1/AZ = 2
    * Gain D for M1/AZ = 3
    * Gain P for M2/EL = 4
    * Gain I for M2/EL = 5
    * Gain D for M2/EL = 6
    * Azimuth park position = 7
    * Elevation park position = 8
    * Control mode (position = 0, speed = 1) = 9
* CW, Write config, register [0-x]
    * Gain P for M1/AZ = 1
    * Gain I for M1/AZ = 2
    * Gain D for M1/AZ = 3
    * Gain P for M2/EL = 4
    * Gain I for M2/EL = 5
    * Gain D for M2/EL = 6
    * Azimuth park position = 7
    * Elevation park position = 8
    * This reg is set from Vx commands control mode (position = 0, speed = 1) = 9
* RB, custom command to reboot controller

## Controller Configurations

* Stepper Motor
    * Endstops
    * Encoders, optional
    * UART or R485 (For both options the firmware is the same)
* DC Motor
    * Endstops
    * Encoders
    * UART or RS485 (For both options the firmware is the same)

## Pins Configuration

```
M1IN1 10, Step or PWM1
M1IN2 9, Direction or PWM2
M1SF  7, Status flag
M1FB  A1, Load measurment

M2IN1 11, Step or PWM1
M2IN2 3, Direction or PWM2
M2SF  6, Status flag
M2FB  A0, Load measurment

MOTOR_EN 8, Enable/Disable motors

SW1 5, Endstop for axis 1
SW2 4, Endstop for axis 2

RS485_DIR 2, RS485 Half Duplex direction pin

SDA_PIN 3, Data I2C pin
SCL_PIN 4, Clock I2C pin

PIN12 12, Digital output pin
PIN13 13, Digital output pin
A2    A2, Analog input pin
A3    A3, Analog input pin
```

## Testing with hamlib - rotctl or with Serial Monitor

Connect the PC with contreller via UART to USB or RS485 to USB by using the right converter (as described in [rotator controller BOM](https://gitlab.com/librespacefoundation/satnogs/satnogs-rotator-controller/blob/master/satnogs-rotator-controller-bom.ods)).
For both options must be soldered the suitable components as descrided in [rotator controller wiki page](https://wiki.satnogs.org/SatNOGS_Rotator_Controller).

Use commands of rotctl:

```
rotctl -m 204 -s 19200 -r /dev/ttyUSB1 -vvvvv
```

Replace the /dev/ttyUSB1 with the device which is connected to PC.

Use commands of easycomm 3:

Send directly commands of easycomm 3 as described in Easycomm implemantation section.

## Contribute

The main repository lives on [Gitlab](https://gitlab.com/librespacefoundation/satnogs/satnogs-rotator-firmware) and all Merge Request should happen there.

## License

[![Libre Space Foundation](https://img.shields.io/badge/%C2%A9%202014--2018-Libre%20Space%20Foundation-6672D8.svg)](https://librespacefoundation.org/)

Licensed under the [GPLv3](LICENSE)
