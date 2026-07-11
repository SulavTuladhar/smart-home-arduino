import dotenv from "dotenv";
import mqtt from 'mqtt';

dotenv.config();

const brokerUrl = `mqtt://${process.env.MQTT_BROKER_HOST}:${process.env.MQTT_BROKER_PORT}`;

export const mqttClient = mqtt.connect(brokerUrl, {
    clientId: `server-${Date.now()}`,
    clean: true,
    reconnectPeriod: 1000,
});

mqttClient.on("connect", () => {
    console.info("Connected to MQTT broker");
});

mqttClient.on("reconnect", () => {
    console.info("MQTT reconnecting...");
});


mqttClient.on("error", (error) => {
    console.info("MQTT connection error:", error);
});