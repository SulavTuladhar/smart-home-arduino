export interface DeviceSummaryDto {
    deviceId: string;
    room: string;
    online: boolean;
    lastSeen: Date | null;
    relayCount: number;
}