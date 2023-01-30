# Hardware

## Setup

- Download the PlatformIO extension for VSCode
  - Add the AtmelAVR platform from the platforms menu in home
  - The current project is confiigured for - found on the board menu, this changes the PIO ini file for the project
  - Make sure any libraries used are added, in this project including Arduino.h (default), Stepper.h, Servo.h and DS3231.h again, Libraries in home menu
- Initialise a project in the hardware folder (this has already been done)
- If there are issues with includes (in particular Arduino.h), add 
  "/home/<username>/.platformio/packages/**" to your include path 
  (temporary fix/not sure this is the solution)


## Serial Inputs

To communicate with backend orchestration, serial communication will be used between the Arduino and main computer (RPi), a specific format is expected to do this properly - this specification is also dispersed in the locations where serial read is done. It's intended to where possible minimise the number of bytes to communicate, still not to the maximum extent, largely due to the limitation of the serial buffer size, so fewer serial reads are required (64 byte size). Some padding is used on either end to mark the beginnings and ends of intentional instructions, and keep instructions, particularly azimuth and elevation, 4-byte word aligned.

For the below formats, symbols represent:
- `~` - Marker byte, there are two of these making up the UTF-8 character `0xC2AA` (2 bytes long), each `~` is one of those bytes
- `y` - Year, a BCD digit (BCD could be compressed in future, kept this way currently to enable use of keyboard byte input)
- `m` - Month, a BCD digit
- `d` - Date, a BCD digit
- `w` - Day of Week, a BCD digit
- `h` - Hour, a BCD digit
- `m` - Minute, a BCD digit
- `s` - Seccond, a BCD digit
- `A` - Azimuth, part of a 2-byte fixed point decimal value (/100)
- `E` - Elevation, part of a 2-byte fixed point decimal value (/100)

### Clock Setting
- Should only be received when hardware starts, to set the RTC allowing us to follow up with scheduling
```
~~yymmddwwhhmmss~~~~
```

### Encounter Instructions
- Multiple instructions can be added up until the end of the instruction set, the datetime beforehand marks the starting time of the encounter for scheduling
```
~~yymmddwwhhmmssAAEE...~~~~
```
