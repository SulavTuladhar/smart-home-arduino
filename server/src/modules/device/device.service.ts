import { AppDataSource } from "../../database/data-source";
import { RelayService } from "../relays/relay.service";
import { Device } from "./device.entity";
import { DeviceRepository, deviceRepository } from "./device.repository";
import { DeviceRegisteration } from "./device.types";

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

            device = await deviceRepository.save(device, manager);
            await this.relayService.syncRelays(device, registration, manager);

            console.log(`Device ${registration.deviceId} registered with ${registration.relayCount} relays`);
        })
    }

    async heartbeat(){}

    async deviceOnline(){}

    async deviceOffline(){}
}