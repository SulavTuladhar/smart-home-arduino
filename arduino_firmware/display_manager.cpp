#include <Arduino.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#include "display_manager.h"

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64

Adafruit_SSD1306 display(
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  &Wire,
  -1
);

void initDisplay(){
  Wire.begin(21,22);

  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)){
    Serial.println("OLED Failed");

    while(true);
  }

  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);
  display.setTextSize(1);

  display.setCursor(0,0);
  display.println("Booting...");
  display.display();
}

void updateDisplay(
  bool wifiConnected,
  bool mqttConnected,
  bool relay1State
){
  display.clearDisplay();
  display.setCursor(0,0);
  display.println("Smart Home");

  display.drawLine(
    0,
    10,
    127,
    10,
    SSD1306_WHITE
  );

  display.setCursor(0, 16);

  display.print("WiFi: ");
  display.println(wifiConnected ? "OK" : "OFF");

  display.print("MQTT: ");
  display.println(mqttConnected ? "OK" : "OFF");

  display.print("Relay1: ");
  display.println(relay1State ? "ON" : "OFF");

  display.display();
}