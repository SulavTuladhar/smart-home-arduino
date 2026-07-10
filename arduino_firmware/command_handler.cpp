#include <Arduino.h>
#include <ArduinoJson.h>

#include "command_handler.h"
#include "relay_manager.h"

// Error handlers
bool checkRelayErrors(const JsonDocument& document, int& channel, bool& state){
  JsonVariantConst channelValue = document["channel"];
  JsonVariantConst stateValue = document["state"];

  if(!channelValue.is<int>()) {
    Serial.println("Relay command rejected: invalid or missing channel");
    return false;
  }

  if(!stateValue.is<bool>()){
    Serial.println("Relay command rejected: invalid or missng state");
    return false;
  }

  channel = channelValue.as<int>();
  state = stateValue.as<bool>();

  return true;
}

void handleRelayCommand(const JsonDocument& document){
  int channel = 0;
  bool state = false;

  bool isRelayCommandValid = checkRelayErrors(document, channel, state);
  
  if(!isRelayCommandValid){
    return;
  }

  bool success = setRelay(channel, state, "MQTT");

  if(!success){
    Serial.println("Relay command failed");
    return;
  }

  Serial.println("Relay command completed");
  return;
}

void handleCommand(const byte* payload, unsigned int length){
  JsonDocument document;

  DeserializationError error = deserializeJson(document, payload, length);

  if(error){
    Serial.print("Command JSO error: ");
    Serial.println(error.c_str());
    return;
  }

  if(!document["command"].is<const char*>()){
    Serial.println("Command rejected: missing command type");
    return;
  }

  const char* command = document["command"];

  Serial.print("Command received: ");
  Serial.println(command);

  if(strcmp(command, "relay") == 0){
    handleRelayCommand(document);
    return;
  }

  Serial.print("Unknown command: ");
  Serial.print(command);
}