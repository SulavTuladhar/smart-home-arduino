export interface DeviceStateMessage {
    device_id: string;
    channel: number;
    state: boolean;
}