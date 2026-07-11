#include <Arduino.h>

#include "config.h"
#include "heartbeat_manager.h"
#include "mqtt_manager.h"

unsigned long lastHeartbeatAt = 0;

void updateHeartbeat(){
    unsigned long currentTime = millis();

    if(currentTime - lastHeartbeatAt < HEARTBEAT_INTERVAL){
        return;
    }

    lastHeartbeatAt = currentTime;

    if(!isMQTTConnected()){
        Serial.println("Heartbeat skipped: MQTT offline");
        return;
    }

    publishHeartbeat();
}