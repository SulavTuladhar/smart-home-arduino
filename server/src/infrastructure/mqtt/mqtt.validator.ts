import { DeviceHeartbeatPayload, DeviceStateMessage } from "./mqtt.types";

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

export function isDeviceHeartbeatPayload(
    value: unknown
): value is DeviceHeartbeatPayload {
    if(typeof value !== "object" || value === null) return false;

    const heartbeat = value as Record<string, unknown>;

    return(
        typeof heartbeat.device_id === "string" &&
        heartbeat.device_id.trim().length > 0 &&
        Number.isInteger(heartbeat.uptime) &&
        (heartbeat.uptime as number) >= 0 &&
        Number.isInteger(heartbeat.free_heap) &&
        (heartbeat.free_heap as number) >= 0 &&
        typeof heartbeat.wifi_rssi === "number"
    );
}