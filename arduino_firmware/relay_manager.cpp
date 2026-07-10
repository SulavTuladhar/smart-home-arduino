#include <Arduino.h>

#include "relay_manager.h"
#include "config.h"

struct Relay {
  int channel;
  int pin;
  bool state;
};

const int relayCount = sizeof(RELAY_PINS) / sizeof(RELAY_PINS[0]);

Relay relays[relayCount];

void initRelays(){
  for(int i = 0; i < relayCount; i++){
    relays[i].channel = i + 1;
    relays[i].pin = RELAY_PINS[i];
    relays[i].state = false;

    pinMode(relays[i].pin, OUTPUT);
    digitalWrite(relays[i].pin, RELAY_OFF);
  }

  Serial.println("Relay Manager Ready Count");
  Serial.println(relayCount);
}

bool setRelay(int channel, bool state, const char* source){
  if(channel < 1 || channel > relayCount){
    Serial.print("Invalid relay channel: ");
    Serial.println(channel);
    return false;
  }

  int index = channel -1;

  relays[index].state = state;
  digitalWrite(relays[index].pin, state ? RELAY_ON : RELAY_OFF);

  Serial.print("Relay ");
  Serial.print(channel);
  Serial.print(state ? " ON by " : " OFF by ");
  Serial.println(source);
  
  return true;
}

bool isRelayOn(int channel){
  if(channel < 1 || channel > relayCount){
    return false;
  }
  return relays[channel -1].state;
}

int getRelayCount(){
  return relayCount;
}