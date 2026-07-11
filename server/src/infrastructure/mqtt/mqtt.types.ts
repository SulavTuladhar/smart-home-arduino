export interface DeviceStateMessage {
    device_id: string;
    channel: number;
    state: boolean;
}

export interface RelayCommand{
    channel: number;
    state: boolean;
}

export interface DeviceHeartbeatPayload {
    device_id: string;
    uptime: number;
    free_heap: number;
    wifi_rssi: number;
}

export interface DeviceHeartbeat {
    deviceId: string;
    uptime: number;
    freeHeap: number;
    wifiRssi: number;
}