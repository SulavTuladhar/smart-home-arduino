export interface DeviceStateMessage {
    device_id: string;
    channel: number;
    state: boolean;
}

export interface RelayCommand{
    channel: number;
    state: boolean;
}