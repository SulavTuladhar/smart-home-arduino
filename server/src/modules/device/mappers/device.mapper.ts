import { Device } from "../domain/device.entity";
import { DeviceDetailsDto } from "../presentation/http/dto/device.details.dto";
import { DeviceSummaryDto } from "../presentation/http/dto/device.summary.dto";

export class DeviceMapper {
    static toSummary(
        device: Device
    ): DeviceSummaryDto {
        return {
            deviceId: device.deviceId,
            room: device.room,
            online: device.online,
            lastSeen: device.lastSeen,
            relayCount: device.relayCount
        }
    }

    static toDetails(
        device: Device
    ): DeviceDetailsDto{
        return {
            deviceId: device.deviceId,
            room: device.room,
            online: device.online,
            lastSeen: device.lastSeen,
            uptime: Number(device.uptime),
            freeHeap: device.freeHeap,
            wifiRssi: device.wifiRssi,
            relayCount: device.relayCount
        }
    }
}