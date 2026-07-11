export interface Relay {
    channel: number;
    gpio: number;
}

export interface DeviceRegisteration {
    deviceId: string;
    room: string;
    relayCount: number;
    relays: Relay[];
}

export interface DeviceRegistrationPayload {
    device_id: string;
    room: string;
    relay_count: number;
    relays: Relay[]
}