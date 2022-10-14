// Simple Arduino code for controlling the hardware. This is placeholder.
// Matt Rossouw (omeh-a)
// 09/22

#include <Stepper.h>
#include <Servo.h>
#include <DS3231.h>

// Stepper motor
const int revolutionSize = 200; // Number of steps for a complete revolution
Stepper stepper(200, 8, 9, 10, 11);

// Servo motor
Servo servo;
#define servoPin 9
#define CLOCK_SET_START 0xAA // Serial marker: binary 1010 1010
#define CLOCK_SET_END 0x55   // Serial marker: binary 0101 0101
#define CLOCK_SET_LENGTH 18  // If there aren't 18 bytes, something has gone wrong.

// Real time clock
DS3231 rtc;

void setup()
{
    servo.attach(servoPin);
    Serial.begin(12800)
        Wire.begin();

    // Wait until the time of date is set before continuing.
    // Server will deliver this over serial.
    byte buffer[CLOCK_SET_LENGTH];
    int buf_offset = 0;
    while (1)
    {
        // We have a full buffer, so we can set the time.
        if (buf_offset >= CLOCK_SET_LENGTH)
        {
            break;
        }

        // Otherwise, read in the next byte.
        if (Serial.available())
        {
            buffer[buf_offset] = Serial.read();
            buf_offset++;
        }
    }

    // Try set the time. Begin by checking the start and end markers.
    if (buffer[0] != CLOCK_SET_START >> 8 || buffer[1] != CLOCK_SET_START & 0xFF)
    {
        fatal("Invalid start marker.");
        return;
    }
    if (buffer[CLOCK_SET_LENGTH - 2] != CLOCK_SET_END >> 8 || buffer[CLOCK_SET_LENGTH - 1] != CLOCK_SET_END & 0xFF)
    {
        fatal("Invalid end marker.");
        return;
    }
    // Start clock
    rtc.setClockMode(false);    // 24 hour mode


    // Set RTC fields
    rtc.setYear(buffer[2] << 8 | buffer[3]);
    rtc.setMonth(buffer[4] << 8 | buffer[5]);
    rtc.setDate(buffer[6] << 8 | buffer[7]);
    rtc.setDoW(buffer[8] << 8 | buffer[9]);
    rtc.setHour(buffer[10] << 8 | buffer[11]);
    rtc.setMinute(buffer[12] << 8 | buffer[13]);
    rtc.setSecond(buffer[14] << 8 | buffer[15]);


    // Zero gantry. TODO: write this code once we add a limit switch, etc. for this.
    //              For now we assume the servo begins pointing at true north.
}

void loop()
{
    // Print current time to serial
    Serial.print(rtc.getYear());
    Serial.print("-");
    Serial.print(rtc.getMonth());
    Serial.print("-");
    Serial.print(rtc.getDate());
    Serial.print(" ");
    Serial.print(rtc.getHour());
    Serial.print(":");
    Serial.print(rtc.getMinute());
    Serial.print(":");
    Serial.print(rtc.getSecond());
    Serial.println();
    sleep(1000);
}

/**
 * @brief Fatal error handler. Prints the error message and spinlocks forever.
 * 
 * @param msg Output message literal.
 */
void fatal(char *msg)
{
    Serial.println(msg);
    while (1);
}