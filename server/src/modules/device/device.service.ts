import { AppDataSource } from "../../database/data-source";
import { relayService } from "../relays/relay.service";
import { Device } from "./device.entity";
import { deviceRepository } from "./device.repository";
import { DeviceRegisteration } from "./device.types";

export class DeviceService {    
    async registerDevice(registration: DeviceRegisteration): Promise<void> {
        await AppDataSource.transaction(async (manager) => {
            let device = await deviceRepository.findByDeviceId(registration.deviceId, manager);

            if(!device) {
                device = new Device();
                device.deviceId = registration.deviceId; 
            }

            device.room = registration.room;
            device.relayCount = registration.relayCount;
            device.online = true;

            device = await deviceRepository.save(device, manager);
            await relayService.syncRelays(device, registration, manager);

            console.log(`Device ${registration.deviceId} registered with ${registration.relayCount} relays`);
        })
    }

    async heartbeat(){}

    async deviceOnline(){}

    async deviceOffline(){}
}

export const deviceService = new DeviceService();