import { ApplicationContainer } from "../../app/application.container";
import { MQTT_TOPICS } from "../../shared/constants";
import { isDeviceHeartbeatTopic, isDeviceRegistrationPayload, isDeviceStateTopic, mapDeviceHeartbeat, mapDeviceRegistration, parseJsonPayload } from "./mqtt.utils";
import { isDeviceHeartbeatPayload, isRelayStateMessage } from "./mqtt.validator";
import type { MqttClient } from "mqtt";

export function startMqttSubscriber(
  mqttClient: MqttClient
): void {
  const container = new ApplicationContainer();
    const subscribeToTopics = (): void => {
      mqttClient.subscribe([MQTT_TOPICS.DEVICE_REGISTER_TOPIC, MQTT_TOPICS.DEVICE_STATE_TOPIC, MQTT_TOPICS.DEVICE_HEARTBEAT_TOPIC], (error, granted) => {
        if (error){ 
            console.error("MQTT subscription failed:", error.message); 
            return; 
        }
        console.info("MQTT subscribed to:", [MQTT_TOPICS.DEVICE_REGISTER_TOPIC, MQTT_TOPICS.DEVICE_STATE_TOPIC, MQTT_TOPICS.DEVICE_HEARTBEAT_TOPIC]);
        console.info("MQTT subscription granted:", granted);
      });
    }

    mqttClient.on("connect", () => {
        console.log("Connected to MQTT broker");
        subscribeToTopics();
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
        await container.services.deviceService.registerDevice(registration);
        return;
      }

      if (isDeviceStateTopic(topic)) {
        if (!isRelayStateMessage(parsedPayload)) {
          console.error("Invalid relay state payload");
          console.error("Payload:", parsedPayload);
          return;
        }
        try{
          await container.services.relayService.updateRelayState(parsedPayload);
          console.info("Relay state saved successfully");
        }catch(err){
          console.error("Failed to update relay state");
        }
        return;
      }

      if(isDeviceHeartbeatTopic(topic)){
        if(!isDeviceHeartbeatPayload(parsedPayload)){
          console.error("Invalid device heartbeat payload", parsedPayload);
          return;
        }

        const heartbeat = mapDeviceHeartbeat(parsedPayload);
        await container.services.deviceService.recordHeartbeat(heartbeat);
        return;
      }

    } catch (error) {
      console.error(
        "MQTT message handling failed:",
        error instanceof Error ? error.message : error
      );
    }
  });

  if(mqttClient.connected){
    console.log("MQTT already connected");
    subscribeToTopics();
  }
}