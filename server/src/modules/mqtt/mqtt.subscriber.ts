import { MQTT_TOPICS } from "../../libs/constants";
import { mqttClient } from "./mqtt.client";

export function startMqttSubscriber(): void {
    mqttClient.on("connect", () => {
        mqttClient.subscribe(MQTT_TOPICS.DEVICE_STATE_TOPIC, (error) => {
            if (error){ 
                console.error("MQTT subscription error:", error.message); 
                return; 
            }
            console.log("MQTT subscribed to:", MQTT_TOPICS.DEVICE_STATE_TOPIC);
        });
    });

    mqttClient.on("message", (topic, payload) => {
        const topicParts = topic.split("/");

        const isDeviceStateTopic = topicParts.length === 4 && topicParts[0] === "home" && topicParts[2] === "device" && topicParts[3] === "state";
        if (!isDeviceStateTopic) return;

        const room = topicParts[1];
        const rawMessage = payload.toString();

        console.log("Relay State Received");
        console.log("Room:", room);
        console.log("Topic:", topic);
        console.log("Message:", rawMessage);
    });
}