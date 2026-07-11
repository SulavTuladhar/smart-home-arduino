import { AppDataSource } from "../../../database/data-source";
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

    async heartbeat(){}

    async deviceOnline(){}

    async deviceOffline(){}
}