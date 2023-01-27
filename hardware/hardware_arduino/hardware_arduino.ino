// Simple Arduino code for controlling the hardware. This is placeholder.
// Matt Rossouw (omeh-a)
// 09/22
// changed bit patterns to bcd
// Jennifer King (jenn-ylk)
// 10/22
// skeleton of serial communication with orchestration backend
// jenn-ylk, 01/23

#include <Arduino.h>
#include <Stepper.h>
#include <Servo.h>
#include <DS3231.h>
#include <stdlib.h>

// To match orch - BAUDRATE = 115200
// orchestration encodes as UTF-8, 16 bytes per instruction (Though we'll likely wa)
// once we get that decoded, should be:
// - asimuth (written as aa.aaaa), elevation (again, ee.eeee)
// overall, becomes b'aa.aaaa,ee.eeee\0' (16B per instruction)

// TODO: have a placeholder function that will translate the current groundstation position (asimuth and elevation it's currently pointing) diff with goal point and create an instruction of how much to move the motor

#define INSTR_SIZE 16
#define NUM_INSTR 4
#define MAX_POS 300
#define READ_BUF_LEN 64
// Instruction scheduling
/*
class InstructionScheduler {

}
*/

struct InstructionList
{
    unsigned long start;
    Instruction *first;
    Instruction *last;
};

struct Instruction
{
    float az;
    float el;
    Instruction *next;
};

InstructionList *new_instruction_list(InstructionList *list, unsigned long start); 
InstructionList * read_instructions(InstructionList *instr_buf);
Instruction interpret_instruction(byte instr[INSTR_SIZE]);
unsigned long execute_instruction(InstructionList *instr_buf);
void print_instructions(InstructionList *instr_buf);

// Stepper motor
const int revolutionSize = 200; // Number of steps for a complete revolution
Stepper stepper(revolutionSize, 8, 9, 10, 11);

// Servo motor
Servo servo;
#define servoPin 9
// Real time clock
#define CLOCK_SET_START 0xC2AA // Serial marker: binary 1010 1010
#define CLOCK_SET_END 0x550A   // Serial marker: binary 0101 0101
#define CLOCK_SET_LENGTH 18    // If there aren't 18 bytes, something has gone wrong.
    // #define CLOCK_SET_LENGTH 12  // If there aren't 12 bytes, something has gone wrong.

InstructionList * instr_buf = NULL;
float current_az = 0;
float current_el = 0;

DS3231 rtc;
bool century_bit;
bool h12;
bool pm_time;
// TODO: later replace with a once per second rtc interrupt for better accuracy
unsigned long last_exec = 0;
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
            if (buf_offset == 2 && (buffer[0] != ((CLOCK_SET_START >> 8) & 0xFF) || buffer[1] != (CLOCK_SET_START & 0xFF)))
            {
                // start byte hasn't been recieved yet, reset and try again
                buf_offset = 0;
            }
        }
    }

    for (int i = 0; i < CLOCK_SET_LENGTH; i++)
    {
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
    rtc.setClockMode(false); // 24 hour mode

    // Set RTC fields

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
    rtc.setYear(10 * (buffer[2] - '0') + (buffer[3] - '0'));
    rtc.setMonth(10 * (buffer[4] - '0') + (buffer[5] - '0'));
    rtc.setDate(10 * (buffer[6] - '0') + (buffer[7] - '0'));
    rtc.setDoW(10 * (buffer[8] - '0') + (buffer[9] - '0'));
    rtc.setHour(10 * (buffer[10] - '0') + (buffer[11] - '0'));
    rtc.setMinute(10 * (buffer[12] - '0') + (buffer[13] - '0'));
    rtc.setSecond(10 * (buffer[14] - '0') + (buffer[15] - '0'));

    // Zero gantry. TODO: write this code once we add a limit switch, etc. for this.
    //              For now we assume the servo begins pointing at true north.

    Serial.println("Ending setup");
    Serial.setTimeout(50);
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

    // TODO: retrieve instructions periodically
    // presumably, backend sends up to 300 instructions at once
    // these just go to the serial buffer, and don't have to go to read_buf immediately
    instr_buf = read_instructions(instr_buf);

    unsigned long now = millis();
    if (now - last_exec >= 1000)
    {
        execute_instruction(instr_buf);
    }
}

// TODO:
InstructionList *new_instruction_list(InstructionList *list, unsigned long start) {
    InstructionList *new_list = (InstructionList *) malloc(sizeof(InstructionList));
    new_list->start = start;
    new_list->first = NULL;
    new_list->last = NULL;

    return new_list;
}

InstructionList *read_instructions(InstructionList *instr_buf)
{
    char read_buf[READ_BUF_LEN] = {0};
    int num_bytes = Serial.readBytes(read_buf, READ_BUF_LEN);
    for (int i = 0; i < num_bytes; i++)
    {
        // TODO: interpret actual bytes for instructions
        float az = 0;
        float el = 0;
        add_instruction(instr_buf, az, el);
        read_buf[i * INSTR_SIZE];
    }
}

void add_instruction(InstructionList *instr_buf, float az, float el) 
{
    Instruction *new_instr = (Instruction *) malloc(sizeof(Instruction));
    if (new_instr == NULL) fatal("Could not allocate memory for new instruction\n");
    new_instr->az = az;
    new_instr->el = el;
    new_instr->next = NULL;
    if (instr_buf->first != NULL) 
    {
        instr_buf->last->next =  new_instr;
        instr_buf->last = new_instr;
    } else 
    {
        instr_buf->first = new_instr;
        instr_buf->last = new_instr;
    }
}


// TODO: ideally we want an interrupt driven once per second execution
unsigned long execute_instruction(InstructionList *instr_buf)
{
    Instruction *executed = instr_buf->first;
    instr_buf->first = executed->next;
    // TODO: execute instruction with servo
    // servo.
    free(executed);
}

void print_instructions(InstructionList *instr_buf) {
    // TODO:
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
