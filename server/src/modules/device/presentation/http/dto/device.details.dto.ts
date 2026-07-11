export interface DeviceDetailsDto {
    deviceId: string;
    room: string;
    online: boolean;
    lastSeen: Date | null;
    uptime: number;
    freeHeap: number;
    wifiRssi: number | null;
    relayCount: number;
}