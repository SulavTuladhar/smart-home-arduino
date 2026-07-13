import { env } from "./env";

export const mqttConfig = {
    host: env.MQTT_BROKER_HOST,
    port: env.MQTT_BROKER_HOST
} as const