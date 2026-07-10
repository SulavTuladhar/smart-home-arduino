#ifndef DISPLAY_MANAGER_H
#define DISPLAY_MANAGER_H

void initDisplay();

void updateDisplay(
  bool wifiConnected,
  bool mqttConnected,
  bool relay1State
);

#endif