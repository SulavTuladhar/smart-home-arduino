import { MQTT_TOPICS } from "../../libs/constants";
import { deviceService } from "../device/device.service";
import { mqttClient } from "./mqtt.client";
import { isDeviceRegistrationPayload, isDeviceStateTopic, mapDeviceRegistration, parseJsonPayload } from "./mqtt.utils";
import { isRelayStateMessage } from "./mqtt.validator";

export function startMqttSubscriber(): void {
    mqttClient.on("connect", () => {
        mqttClient.subscribe([MQTT_TOPICS.DEVICE_REGISTER_TOPIC, MQTT_TOPICS.DEVICE_STATE_TOPIC], (error, granted) => {
            if (error){ 
                console.error("MQTT subscription failed:", error.message); 
                return; 
            }
            console.info("MQTT subscribed to:", [MQTT_TOPICS.DEVICE_REGISTER_TOPIC, MQTT_TOPICS.DEVICE_STATE_TOPIC]);
            console.info("MQTT subscription granted:", granted);
        });
    });

    
  mqttClient.on("message", async (topic, payload) => {
    try {
      const parsedPayload = parseJsonPayload(topic, payload);

      if (parsedPayload === null) {
        return;
      }

      if (topic === MQTT_TOPICS.DEVICE_REGISTER_TOPIC) {
        if (!isDeviceRegistrationPayload(parsedPayload)) {
          console.error("Invalid device registration payload");
          console.error("Payload:", parsedPayload);
          return;
        }
        const registration = mapDeviceRegistration(parsedPayload)
        await deviceService.registerDevice(registration);
        return;
      }

      if (isDeviceStateTopic(topic)) {
        if (!isRelayStateMessage(parsedPayload)) {
          console.error("Invalid relay state payload");
          console.error("Payload:", parsedPayload);
          return;
        }
        // await relayService.updateRelayState(parsedPayload);
        return;
      }

    } catch (error) {
      console.error(
        "MQTT message handling failed:",
        error instanceof Error ? error.message : error
      );
    }
  });
}