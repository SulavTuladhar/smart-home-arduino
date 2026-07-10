#include "config.h"
#include "secrets.h"
#include "device_manager.h"
#include "wifi_manager.h"
#include "mqtt_manager.h"
#include "relay_manager.h"
#include "display_manager.h"

void setup(){
  Serial.begin(115200);

  initDevice();
  initDisplay();
  initRelays();
  connectWiFi();
  setupMQTT();
  connectMQTT();
}

void loop(){
  mqttLoop();
  updateDisplay(
    isWiFiConnected(),
    isMQTTConnected(),
    isRelayOn(1)
  );
  // publishMotionEvent(motionCount, relay1On);
}