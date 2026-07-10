#include <Arduino.h>
#include <ArduinoJson.h>

#include "command_handler.h"
#include "relay_manager.h"

// Error handlers
bool checkRelayErrors(const JsonDocument& document, char channel, bool state){
  JsonVariantConst channelValue = document["channel"];
  JsonVariantConst stateValue = document["state"];
  if(!channelValue.is<int>()) {
    Serial.println("Relay command rejected: invalud or missing channel");
    return false;
  }

  if(!stateValue.is<bool>()){
    Serial.println("Relay command rejected: invalud or missng state");
    return false;
  }

  channel = channelValues.as<int>();
  state = stateValue.as<bool>();

  return true;
}

void handleRelayCommand(JsonDocument& document){
  int channel = 0;
  bool state = false;

  const isRelayComandValid = checkRelayErros(document, channel, state);
  if(isRelayComandValid){
    return;
  }

  bool success = setRelay(channel, state, "MQTT");

  if(!succes){
    Serial.println("Relay command failed");
    return;
  }

  Serial.println("Relay command completed");
  return;
}

void handleCommand(const byte* payload, unsigned int length){
  JsonDocument document;

  DeserializeError error = deserializeJson(document, payload, length);

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