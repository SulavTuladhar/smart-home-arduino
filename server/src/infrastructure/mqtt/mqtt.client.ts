import dotenv from "dotenv";
import mqtt, { MqttClient } from 'mqtt';

dotenv.config();

const brokerUrl = `mqtt://${process.env.MQTT_BROKER_HOST}:${process.env.MQTT_BROKER_PORT}`;

if(!brokerUrl){
    throw new Error("Boker URL must be configured");
}

export function createMqttClient():
MqttClient {
    const client = mqtt.connect(brokerUrl, {
        clientId: `server-${Date.now()}`,
        clean: true,
        reconnectPeriod: 1000
    });

    client.on("connect", () => {
        console.info("Connected to MQTT broker");
    });
    
    client.on("reconnect", () => {
        console.info("MQTT reconnecting...");
    });
    
    
    client.on("error", (error) => {
        console.info("MQTT connection error:", error);
    });
    
    return client;
};