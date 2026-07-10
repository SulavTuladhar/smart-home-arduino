#include <Arduino.h>

#include "config.h"
#include "device_manager.h"

void initDevice(){
  Serial.println("Initializing device ...");
  Serial.print("Device ID: ");
  Serial.println(DEVICE_ID);
}

const char* getDeviceId(){
  return DEVICE_ID;
}