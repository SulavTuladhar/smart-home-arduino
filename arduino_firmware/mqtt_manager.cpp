// mosquitto_pub -h 192.168.1.122 -p 1883 -t home/livingroom/relay/set -m "{\"channel\":1, \"state\": true}"
#include <WiFi.h>
#include <ArduinoJson.h>
#include <PubSubClient.h>

#include "mqtt_manager.h"
#include "relay_manager.h"
#include "command_handler.h"
#include "secrets.h"
#include "config.h"

WiFiClient wifiClient;
PubSubClient mqtt(wifiClient);

// Register Device
void registerDevice(){
  StaticJsonDocument <512> doc;

  doc["device_id"] = DEVICE_ID;
  doc["room"] = ROOM_NAME;
  doc["relay_count"] = getRelayCount();

  JsonArray relays = doc.createNestedArray("relays");

  for(int i = 0; i< getRelayCount(); i++){
    JsonObject relay = relays.createNestedObject();

    relay["channel"] = i + 1;
    relay["gpio"] = RELAY_PINS[i];
  }

  char buffer[512];

  serializeJson(doc, buffer);

  mqtt.publish(DEVICE_REGISTER_TOPIC, buffer);

  Serial.println();
  Serial.println("Device Regstered");
  Serial.println(buffer);
}

// Validate Relay Command
bool parseRelayCommand(byte* payload, unsigned int length, int& channel, bool& state){
  StaticJsonDocument <256> doc;

  DeserializationError error = deserializeJson(doc, payload, length);

  if(error){
    Serial.print("JSON parse failed: ");
    Serial.println(error.c_str());
    return false;
  }

  if(!doc.containsKey("channel")){
    Serial.print("Invalid command: missing channel");
    return false;
  }

  if(!doc.containsKey("state")){
    Serial.println("Invalid command: missing state");
    return false;
  }

  channel = doc["channel"];
  state = doc["state"];
  
  return true;
}

void mqttCallback(char* topic, byte* payload, unsigned int length){
  Serial.println();
  Serial.println("=========================== MQTT =====================");

  Serial.print("MQTT Topic: ");
  Serial.println(topic);

  if(String(topic) != RELAY_COMMAND_TOPIC){
    Serial.println("Ignored unknown topic");
    Serial.println("=================================================");
    return;
  }

  handleCommand(payload, length);
  Serial.println("=================================================");
}

void setupMQTT(){
  Serial.print("Broker: ");
  Serial.println(MQTT_BROKER);

  Serial.print("PORT: ");
  Serial.println(MQTT_PORT);

  mqtt.setServer(MQTT_BROKER, MQTT_PORT);
  mqtt.setCallback(mqttCallback);
}

void connectMQTT(){
  while(!mqtt.connected()){
    Serial.print("Connecting MQTT...");

    if(mqtt.connect(DEVICE_ID)){
      Serial.println("Connected");

      bool subscribed = mqtt.subscribe(DEVICE_COMMAND_TOPIC);

      if(subscribed){
        Serial.println("Subscribed to device command topic");
      }else{
        Serial.println("Failed to subscribed to device command topic");
      }
     
      registerDevice();
      return;
    }

    Serial.print("Failed State: ");
    Serial.println(mqtt.state());
    delay(2000);
  }
}

void mqttLoop(){
  if(!mqtt.connected()){
    connectMQTT();
  }
  mqtt.loop();
}

void publishMotionEvent(int motionCount, bool relayState){
  if(!mqtt.connected()) return;

  String payload = "{";

  payload += "\"deviceId\":\"";
  payload += DEVICE_ID;
  payload += "\",";

  payload += "\"motion\"true,";

  payload += "\"count\":";
  payload += motionCount;
  payload += ",";

  payload += "\"relay\":";
  payload += relayState ? "true" : "false";

  payload += "}";

  mqtt.publish("home/livingroom/motion", payload.c_str());
}

bool isMQTTConnected(){
  return mqtt.connected();
}