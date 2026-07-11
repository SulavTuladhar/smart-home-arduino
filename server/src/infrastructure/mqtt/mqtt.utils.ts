import { DeviceRegisteration, DeviceRegistrationPayload } from "../../modules/device/domain/device.types";

export function isDeviceStateTopic(topic: string): boolean {
    const topicParts = topic.split("/");
    return topicParts.length === 4 && topicParts[0] === "home" && topicParts[1].length > 0 && topicParts[2] === "device" && topicParts[3] === "state";
}

export function isDeviceRegistrationPayload(
    value: unknown
  ): value is DeviceRegistrationPayload {
    if (typeof value !== "object" || value === null) {
      return false;
    }
  
    const registration = value as Record<string, unknown>;
  
    if (
      typeof registration.device_id !== "string" ||
      registration.device_id.trim().length === 0
    ) {
      return false;
    }
  
    if (
      typeof registration.room !== "string" ||
      registration.room.trim().length === 0
    ) {
      return false;
    }
  
    if (
      !Number.isInteger(registration.relay_count) ||
      (registration.relay_count as number) < 0
    ) {
      return false;
    }
  
    if (!Array.isArray(registration.relays)) {
      return false;
    }
  
    const relaysAreValid = registration.relays.every((relay) => {
      if (typeof relay !== "object" || relay === null) {
        return false;
      }
  
      const relayRecord = relay as Record<string, unknown>;
  
      return (
        Number.isInteger(relayRecord.channel) &&
        (relayRecord.channel as number) > 0 &&
        Number.isInteger(relayRecord.gpio) &&
        (relayRecord.gpio as number) >= 0
      );
    });
  
    if (!relaysAreValid) {
      return false;
    }
  
    return (
      registration.relays.length ===
      (registration.relay_count as number)
    );
  }

export const parseJsonPayload = (topic: string, payload: Buffer): unknown | null => {
    const payloadString = payload.toString();
    try {
        return JSON.parse(payloadString) as unknown;
    } catch (error) {
        console.error("Invalid JSON payload:", payload, error);
        return null;
    }
}
  
export function mapDeviceRegistration(
  payload: DeviceRegistrationPayload
): DeviceRegisteration {
  return {
    deviceId: payload.device_id,
    room: payload.room,
    relayCount: payload.relay_count,
    relays: payload.relays,
  };
}