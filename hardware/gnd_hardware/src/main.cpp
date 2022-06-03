#include <Arduino.h>
// hardware code TODO: give more description
// I believe this has the correct paths for platformIO (info in readme)

// currently just blinks an LED and ~prints something to the terminal~

void setup() {
  // put your setup code here, to run once:
  pinMode(LED_BUILTIN, OUTPUT);
  // TODO: concerned that this is coming up with include errors, 
  // that there might be other issues with the include path to resolve
  // Serial.begin(9600);
  // Serial.print("Starting\n");
}

void loop() {
  // put your main code here, to run repeatedly:
  
  // turn the LED on (HIGH is the voltage level)
  digitalWrite(LED_BUILTIN, HIGH);
  // wait for a second
  delay(1000);
  // turn the LED off by making the voltage LOW
  digitalWrite(LED_BUILTIN, LOW);
   // wait for a second
  delay(1000);
}