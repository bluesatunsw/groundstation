# Formats

This file contains the specifications for cross-subsystem communication.

## Hardware communication

All communications delivering information to or from the groundstation microcontroller.

### **RTC configuration**

The real time clock must be set before transmission of antenna positions can begin.

#### *CLOCK_SET_START*

Serial marker appears at the start of set.

HEX: `0xAA`

BIN: `1010 1010`

BASE10: 170

UTF8: 'ª'

#### *CLOCK_SET_END*

Serial marker appears at the end of set.

HEX: `0x55`

BIN: `0101 0101`

BASE10: 85

UTF8: 'U'

#### *CLOCK_SET format*

Between the start and end markers, the target date and time is encoded as unsigned integers as follows.

`CLOCK_SET_START`

`0x00`: Year,

`0x20`: Month,

`0x40`: Day of month,

`0x60`: Day of week,

`0x80`: Hour,

`0xA0`: Minute,

`0xC0`: Second.

`CLOCK_SET_END`

