// Simple Arduino code for controlling the hardware. This is placeholder.
// Matt Rossouw (omeh-a)
// 09/22
// changed bit patterns to bcd
// Jennifer King (kingj2018)
// 10/22

#include <Stepper.h>
#include <Servo.h>
#include <DS3231.h>

// Stepper motor
const int revolutionSize = 200; // Number of steps for a complete revolution
Stepper stepper(200, 8, 9, 10, 11);

// Servo motor
Servo servo;
#define servoPin 9
#define CLOCK_SET_START 0xC2AA // Serial marker: binary 1010 1010
#define CLOCK_SET_END 0x550A   // Serial marker: binary 0101 0101
#define CLOCK_SET_LENGTH 18  // If there aren't 18 bytes, something has gone wrong.
// #define CLOCK_SET_LENGTH 12  // If there aren't 12 bytes, something has gone wrong.

// Real time clock
DS3231 rtc;
bool century_bit;
bool h12;
bool pm_time;
// 1100001010101010000001111110011000001011000000100000010000000101000000000101010100001010
void setup()
{
  servo.attach(servoPin);
  Serial.begin(19200);
  Serial.println("Starting");
  Wire.begin();

  // Wait until the time of date is set before continuing.
  // Server will deliver this over serial.
  byte buffer[CLOCK_SET_LENGTH];
  int buf_offset = 0;
  // Loop until buffer is full.
  while (buf_offset < CLOCK_SET_LENGTH)
  {

    // Otherwise, read in the next byte.
    if (Serial.available())
    {
      buffer[buf_offset] = Serial.read();
      buf_offset++;
      // check first two bytes
      if (buf_offset == 2 && (buffer[0] != ((CLOCK_SET_START >> 8) & 0xFF) || buffer[1] != (CLOCK_SET_START & 0xFF))) {
        // start byte hasn't been recieved yet, reset and try again
        buf_offset = 0;
      }
    }
  }

  for  (int i = 0; i < CLOCK_SET_LENGTH; i++) {
    Serial.println(buffer[i], HEX);
  }
  // Try set the time. Begin by checking the start and end markers.
  if (buffer[0] != ((CLOCK_SET_START >> 8) & 0xFF) || buffer[1] != (CLOCK_SET_START & 0xFF))
  {
    char msg[] = "Invalid start marker.";
    fatal(msg);
    return;
  }
  if (buffer[CLOCK_SET_LENGTH - 2] != ((CLOCK_SET_END >> 8) & 0xFF) || buffer[CLOCK_SET_LENGTH - 1] != (CLOCK_SET_END & 0xFF))
  {
    char msg[] = "Invalid end marker.";
    fatal(msg);
    return;
  }
  // Start clock
  rtc.setClockMode(false);    // 24 hour mode


  // Set RTC fields
  // to look up the corresponding utf8 characters, go here: https://onlineutf8tools.com/convert-binary-to-utf8
  // (one option) - issue is not all bit combos will have a valid utf-8 character
  /*
  rtc.setYear(buffer[2] << 8 | buffer[3]);
  rtc.setMonth(buffer[4] << 8 | buffer[5]);
  rtc.setDate(buffer[6] << 8 | buffer[7]);
  rtc.setDoW(buffer[8] << 8 | buffer[9]);
  rtc.setHour(buffer[10] << 8 | buffer[11]);
  rtc.setMinute(buffer[12] << 8 | buffer[13]);
  rtc.setSecond(buffer[14] << 8 | buffer[15]);
  */

  // basic, just to check loop (2022, Wed 2nd November, 12:05)
  /*
  rtc.setYear(22);
  rtc.setMonth(11);
  rtc.setDate(2);
  rtc.setDoW(4);
  rtc.setHour(12);
  rtc.setMinute(5);
  rtc.setSecond(0);
  */

  // using bcd for everything
  rtc.setYear(10*(buffer[2]-'0') + (buffer[3]-'0'));
  rtc.setMonth(10*(buffer[4]-'0') + (buffer[5]-'0'));
  rtc.setDate(10*(buffer[6]-'0') + (buffer[7]-'0'));
  rtc.setDoW(10*(buffer[8]-'0') + (buffer[9]-'0'));
  rtc.setHour(10*(buffer[10]-'0') + (buffer[11]-'0'));
  rtc.setMinute(10*(buffer[12]-'0') + (buffer[13]-'0'));
  rtc.setSecond(10*(buffer[14]-'0') + (buffer[15]-'0'));
  
  /*
  // using only 12 bytes (only single bytes for small numbers) (incl starting byte)
  rtc.setYear(buffer[2] << 8 | buffer[3]);
  rtc.setMonth(buffer[4]);
  rtc.setDate(buffer[5]);
  rtc.setDoW(buffer[6]);
  rtc.setHour(buffer[7]);
  rtc.setMinute(buffer[8]);
  rtc.setSecond(buffer[9]);
  */

  // Zero gantry. TODO: write this code once we add a limit switch, etc. for this.
  //              For now we assume the servo begins pointing at true north.
  Serial.println("Ending setup");
}

void loop()
{
  // Print current time to serial
  Serial.print(rtc.getYear(), DEC);
  Serial.print("-");
  Serial.print(rtc.getMonth(century_bit), DEC);
  Serial.print("-");
  Serial.print(rtc.getDate(), DEC);
  Serial.print(" ");
  Serial.print(rtc.getHour(h12, pm_time), DEC);
  Serial.print(":");
  Serial.print(rtc.getMinute(), DEC);
  Serial.print(":");
  Serial.print(rtc.getSecond(), DEC);
  Serial.println();
  delay(1000);
}

/**
 * @brief Fatal error handler. Prints the error message and spinlocks forever.
 * 
 * @param msg Output message literal.
 */
void fatal(char msg[])
{
  Serial.println(msg);
  while (1);
}
