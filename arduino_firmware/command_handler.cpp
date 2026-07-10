#include <Arduino.h>
#include <ArduinoJson.h>

#include "command_handler.h"
#include "relay_manager.h"

// Error handlers
void checkRelayErrors(char channel, bool state){
  if(!channel.is<int>()) {
    Serial.println("Relay command rejected: invalud or missing channel");
    return false;
  }

  if(!state.is<bool>()){
    Serial.println("Relay command rejected: invalud or missng state");
    return false;
  }

  return true;
}

void handleRelayCommand(JsonDocument& document){
  int channel = document["channel"];
  bool state = document["state"];

  const doesRelayContainsError = checkRelayErros(channel, state);
  if(doesRelayContainsError){
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

void handleCommand(const byte* payload, unsgned int length){
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