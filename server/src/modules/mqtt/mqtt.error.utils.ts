export const formatMqttErrorMessage = (topic: string, payload: unknown, error: unknown): string => {
    return `MQTT error: Topic: ${topic}, Payload: ${JSON.stringify(payload)}, Error: ${error}`;
}