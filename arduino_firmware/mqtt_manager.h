#ifndef MQTT_MANAGER_H
#define MQTT_MANAGER_H

#include <PubSubClient.h>

extern PubSubClient mqtt;

void registerDevice();
void setupMQTT();
void connectMQTT();
void publishMotionEvent(int motionCount, bool relayState);
void mqttLoop();
bool publishHeartbeat();

bool isMQTTConnected();
bool publishRelayState(int channel, bool state);

#endif