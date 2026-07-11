import { Relay } from "../relays/relay.entity";
import { relayRepository } from "../relays/relay.repository";
import { Device } from "./device.entity";
import { deviceRepository } from "./device.repository";
import { DeviceRegisteration } from "./device.types";

export class DeviceService {    
    async registerDevice(registration: DeviceRegisteration): Promise<void> {
        let device = await deviceRepository.findByDeviceId(registration.deviceId);

        if(!device) {
            device = new Device();
            device.deviceId = registration.deviceId; 
        }

        device.room = registration.room;
        device.relayCount = registration.relayCount;
        device.online = true;

        await deviceRepository.save(device);

        for(const relayRegistration of registration.relays){
            let relay = await relayRepository.findByDeviceAndChannel(registration.deviceId, relayRegistration.channel);
            if(!relay){
                relay = new Relay();
                relay.device = device;
                relay.channel = relayRegistration.channel;
                relay.name = `Relay-${relayRegistration.channel}`;
                relay.desiredState = false;
                relay.acutalState = false;
            }
            relay.gpio = relayRegistration.gpio;
            await relayRepository.save(relay);
        }

        console.log(`Device ${registration.deviceId} registered with ${registration.relayCount} relays`);
    }

    async heartbeat(){}

    async deviceOnline(){}

    async deviceOffline(){}
}

export const deviceService = new DeviceService();