#include <WiFi.h>

#include "wifi_manager.h"
#include "secrets.h"

void connectWiFi(){
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");

  while (WiFi.status() != WL_CONNECTED){
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.println("WiFi Connected");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());
}

bool isWiFiConnected(){
  return WiFi.status() == WL_CONNECTED;
}