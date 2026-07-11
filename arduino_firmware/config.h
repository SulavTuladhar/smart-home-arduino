#ifndef CONFIG_H
#define CONFIG_H

#define DEVICE_ID "esp32-living-room-01"
#define ROOM_NAME "livingroom"

#define PIR_PIN 27

#define RELAY_ON LOW
#define RELAY_OFF HIGH
const int RELAY_PINS[] ={
  26,
  14,
  13,
  25
};

#define LIGHT_HOLD_TIME 5000
#define DISPLAY_INTERVAL 500
#define MQTT_RETRY_INTERVAL 5000

#define DEVICE_REGISTER_TOPIC "home/register"
#define MOTION_TOPIC "home/livingroom/motion"
#define DEVICE_COMMAND_TOPIC "home/livingroom/device/set"
#define DEVICE_STATE_TOPIC "home/livingroom/device/state"

#endif