import mqtt, { MqttClient } from 'mqtt';
import { mqttConfig } from "../../configuration";

const brokerUrl = `mqtt://${mqttConfig.host}:${mqttConfig.port}`;

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