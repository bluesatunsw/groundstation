#include <Arduino.h>
// hardware code TODO: give more description
// I believe this has the correct paths for platformIO (info in readme)

// TODO: figure out how many bytes this would be
#define MAX_INSTR_BYTES 1024

// currently just blinks an LED and ~prints something to the terminal~
char instr_buf[MAX_INSTR_BYTES];

void setup() {
  // put your setup code here, to run once:
  pinMode(LED_BUILTIN, OUTPUT);
  // TODO: concerned that this is coming up with include errors, 
  // that there might be other issues with the include path to resolve
  Serial.begin(9600);
  Serial.print("Starting\n");
}

void loop() {
  // put your main code here, to run repeatedly:
  
  // TODO: fill this in with code that calls to the hardware
  // - control the motors to go to the correct angle
  // - need to have communication in some way from our control 
  //   to tell which angle to go to

  // TODO: need to get data from serial - NOTE: do we know which port will be used?
  if (Serial.available()) {
    Serial.readBytes(instr_buf, MAX_INSTR_BYTES);
  }


  /*
  // turn the LED on (HIGH is the voltage level)
  digitalWrite(LED_BUILTIN, HIGH);
  // wait for a second
  delay(1000);
  // turn the LED off by making the voltage LOW
  digitalWrite(LED_BUILTIN, LOW);
   // wait for a second
  delay(1000);
  */
}