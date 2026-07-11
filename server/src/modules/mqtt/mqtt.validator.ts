import { DeviceStateMessage } from "./mqtt.types";

export function isRelayStateMessage(value: unknown): value is DeviceStateMessage {
    if(typeof value !== "object" || value === null) return false;

    const message = value as Record<string, unknown>;

    return (
        typeof message.device_id === "string" &&
        message.device_id.trim().length > 0 &&
        (message.channel as number) > 0 &&
        typeof message.state === "boolean"
    )
}