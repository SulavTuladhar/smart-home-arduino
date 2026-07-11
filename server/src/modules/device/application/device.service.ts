import { AppDataSource } from "../../../database/data-source";
import { DeviceHeartbeat } from "../../../infrastructure/mqtt/mqtt.types";
import { RelayService } from "../../relays/application/relay.service";
import { Device } from "../domain/device.entity";
import { DeviceRegisteration } from "../domain/device.types";
import { DeviceRepository } from "../infrastructure/device.repository";

export class DeviceService {    
    constructor(
        private readonly deviceRepository: DeviceRepository,
        private readonly relayService: RelayService
    ){}

    async registerDevice(registration: DeviceRegisteration): Promise<void> {
        await AppDataSource.transaction(async (manager) => {
            let device = await this.deviceRepository.findByDeviceId(registration.deviceId, manager);

            if(!device) {
                device = new Device();
                device.deviceId = registration.deviceId; 
            }

            device.room = registration.room;
            device.relayCount = registration.relayCount;
            device.online = true;

            device = await this.deviceRepository.save(device, manager);
            await this.relayService.syncRelays(device, registration, manager);

            console.log(`Device ${registration.deviceId} registered with ${registration.relayCount} relays`);
        })
    }

    async recordHeartbeat(heartbeat: DeviceHeartbeat): Promise<void>{
        await this.deviceRepository.updateHeartbeat(
            heartbeat.deviceId,
            {
                uptime: heartbeat.uptime,
                freeHeap: heartbeat.freeHeap,
                wifiRssi: heartbeat.wifiRssi
            }
        );

        console.info(`Heartbeat recorded for ${heartbeat.deviceId}`);
    }

    async markStaleDevicesOffline(timeoutMilliSeconds: number): Promise<number>{
        const threshold = new Date(Date.now() - timeoutMilliSeconds);

        return this.deviceRepository.markDevicesOfflineBefore(threshold);
    }

    async deviceOnline(){}

    async deviceOffline(){}
}