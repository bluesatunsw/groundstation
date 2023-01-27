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

// To match orch - 
#define BAUDRATE 115200

#define INSTR_SIZE 16
#define NUM_INSTR 4
#define MAX_POS 300
#define READ_BUF_LEN 64
// Instruction scheduling
#define TIME_BYTES 14
#define END_BYTE '~' // TODO: change later

struct Instruction
{
    float az;
    float el;
    Instruction *next;
};

struct InstructionList
{
    char start[TIME_BYTES] = {0};
    Instruction *first;
    Instruction *last;
    InstructionList *next;
};

struct ExecutionQueue
{
    InstructionList *list;
    InstructionList *new_list;
};

ExecutionQueue *new_execution_queue();
void add_instruction_list(ExecutionQueue *queue);
void insert_new_list(ExecutionQueue *queue);
void read_instructions(ExecutionQueue *queue);
void add_instruction(InstructionList *instr_buf, float az, float el);
void execute_instruction(ExecutionQueue *queue);
void print_instr_queue(ExecutionQueue *queue);
void print_instr_list(InstructionList *list);
void print_instr(Instruction *instr);

void free_execution_queue(ExecutionQueue *queue);
void free_instruction_list(InstructionList *list);

void fatal(char msg[]);

// Stepper motor
const int revolutionSize = 200; // Number of steps for a complete revolution
Stepper stepper(revolutionSize, 8, 9, 10, 11);

// Servo motor
Servo servo;
#define servoPin 9
// Real time clock
#define CLOCK_SET_START 0xC2AA // Serial marker: binary 1010 1010
#define CLOCK_SET_END 0xC2AA // 1011 1011 // 0x550A   // Serial marker: binary 0101 0101
#define CLOCK_SET_LENGTH 18    // If there aren't 18 bytes, something has gone wrong.
    // #define CLOCK_SET_LENGTH 12  // If there aren't 12 bytes, something has gone wrong.

ExecutionQueue *instr_queue = NULL;
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
    Serial.begin(BAUDRATE);
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
        Serial.println(buf_offset);
        // Serial.println(buffer[buf_offset]);
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
    
    // set up instruction queue
    instr_queue = new_execution_queue();

    // Zero gantry. TODO: write this code once we add a limit switch, etc. for this.
    //              For now we assume the servo begins pointing at true north.

    Serial.println("Ending setup");
    Serial.setTimeout(50);
}

void loop()
{
    // Print current time to serial
    /*
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
    */
    // delay(1000);

    // TODO: retrieve instructions periodically
    // presumably, backend sends up to 300 instructions at once
    // these just go to the serial buffer, and don't have to go to read_buf immediately
    read_instructions(instr_queue);

    unsigned long now = millis();
    if (now - last_exec >= 1000) execute_instruction(instr_queue);
}


ExecutionQueue *new_execution_queue() {
    ExecutionQueue *new_queue = (ExecutionQueue *) malloc(sizeof(ExecutionQueue));
    new_queue->list = NULL;
    new_queue->new_list = NULL;
    return new_queue;
}

void add_instruction_list(ExecutionQueue *queue) {
    InstructionList *new_list = (InstructionList *) malloc(sizeof(InstructionList));
    new_list->first = NULL;
    new_list->last = NULL;
    new_list->next = NULL;
    if (queue->new_list) insert_new_list(queue);
    queue->list = new_list;
    queue->new_list = new_list;
}

void insert_new_list(ExecutionQueue *queue) {
    // TODO: place the list in the right place according to the start time of the encounter
    if (queue->new_list == NULL) return;
    queue->new_list->next = queue->list;
    queue->list = queue->new_list;
}

// Bytes as follows:
// yymmddwwhhmmss[0x0000]AAEE...[0xFFFFFFFF] (4 bytes per instruction) = 16 + 4 * n_instr + 4 bytes
// yymmddwwhhmmss~~AAEE...~~~~ (4 bytes per instruction) = 16 + 4 * n_instr + 4 bytes
// 00000000000000~~34152308~~~~
// -> everything will be aligned on 4 byte boundaries, all the time, important for the asimuth and elevation, the marker at the end allows to insert the item
// if there's no "newly created" queue, we know that we're in the process of making one, azimuth and elevation will always be aligned on 4 bytes, importantly, making it simple to work with
void read_instructions(ExecutionQueue *queue)
{
    // TODO: only create a new list when the serial input calls for it (timestamp), handle correct insertion in the list
    char read_buf[READ_BUF_LEN] = {0};
    int num_bytes = Serial.readBytes(read_buf, READ_BUF_LEN);
    // all instructions are 4-byte aligned for ease of use
    for (int buf_pos = 0; buf_pos < num_bytes;)
    {   
        if (queue->new_list == NULL) add_instruction_list(queue);
        
        InstructionList *list = queue->new_list;
        if (read_buf[buf_pos] == END_BYTE && read_buf[buf_pos + 1] == END_BYTE && 
            read_buf[buf_pos + 2] == END_BYTE && read_buf[buf_pos + 3] == END_BYTE) {
            insert_new_list(queue);
            buf_pos += 4;
        } else if (list->first == NULL && list->start[TIME_BYTES - 1] != 0) {
            // find how much of the time has been filled in/where to start from
            int i = 0;
            bool byte_err = false;
            for (; i < TIME_BYTES && buf_pos < num_bytes; i++, buf_pos++) {
                if (read_buf[buf_pos] == END_BYTE || read_buf[buf_pos] < '0' || read_buf[buf_pos] > '9') {
                    byte_err = true;
                    break;
                } else if (list->start[i] == 0) {
                    list->start[i] = read_buf[buf_pos];
                }
            }

            if (byte_err ||
                (buf_pos < num_bytes && (read_buf[buf_pos] != END_BYTE || read_buf[buf_pos + 1] != END_BYTE))) {
                // TODO: - we need an orch messaging protocol to resend the bytes, when we had to drop the instructions
                // message orch to say the new instruction set was dropped
                free_instruction_list(list);
                queue->new_list = NULL;
                // quit reading and wait for the buffer to be flushed
                return;
            }
            // set this on the 4 byte boundary as needed
            buf_pos += (4 - (buf_pos % 4)) % 4;
        } else {
            float az = ((read_buf[buf_pos] << 8) + read_buf[buf_pos + 1]) / 100;
            float el = ((read_buf[buf_pos + 2] << 8) + read_buf[buf_pos + 3]) / 100;
            add_instruction(list, az, el);
            buf_pos += 4;
        }
    }
}

void add_instruction(InstructionList *instr_buf, float az, float el) 
{
    Instruction *new_instr = (Instruction *) malloc(sizeof(Instruction));
    if (new_instr == NULL) 
    {
        char msg[] = "Could not allocate memory for new instruction";
        fatal(msg);
    }
    new_instr->az = az;
    new_instr->el = el;
    new_instr->next = NULL;
    if (instr_buf->first != NULL) 
    {
        instr_buf->last->next = new_instr;
        instr_buf->last = new_instr;
    } else 
    {
        instr_buf->first = new_instr;
        instr_buf->last = new_instr;
    }
}


// TODO: ideally we want an interrupt driven once per second execution
void execute_instruction(ExecutionQueue *queue)
{
    Serial.println("Executing an instruction");
    print_instr_queue(queue);
    last_exec = millis();
    if (queue == NULL || queue->list == NULL) return;
    InstructionList *instr_buf = queue->list;
    Instruction *execute = instr_buf->first;
    if (execute != NULL) {
        instr_buf->first = execute->next;
        // TODO: execute instruction with servo
        // servo.
        free(execute);
    }
    // free the list if all instructions have executed
    if (instr_buf->first == NULL) {
        queue->list = instr_buf->next;
        if (queue->new_list == instr_buf) queue->new_list = instr_buf->next;

        free(instr_buf);
    }
}

void print_instr_queue(ExecutionQueue *queue) {
    if (queue == NULL || queue->list == NULL) 
    {
        Serial.println("No instruction lists given");
        return;
    }


    for (InstructionList *list = queue->list; list != NULL; list = list->next) 
    print_instr_list(list);
}

void print_instr_list(InstructionList *list) {
    if (list->first == NULL) {
        Serial.println("No instructions for the encounter");
        return;
    }

    for (Instruction *instr = list->first; instr != NULL; instr = instr->next) print_instr(instr);
}

void print_instr(Instruction *instr) {
    Serial.print("Azimuth = ");
    Serial.print(instr->az);
    Serial.print(", Elevation = ");
    Serial.println(instr->el);

}

void free_execution_queue(ExecutionQueue *queue)
{
    for (InstructionList *node = queue->list; node != NULL; node = node->next) {
        InstructionList *del = node;
        node = node->next;
        free_instruction_list(del);
    }
    free_instruction_list(queue->new_list);
    free(queue);
}

void free_instruction_list(InstructionList *list)
{
    for (Instruction *node = list->first; node != NULL; node = node->next) {
        Instruction *del = node;
        node = node->next;
        free(del);
    }
    free(list);
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
