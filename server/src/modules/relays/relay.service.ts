import { Device } from "../device/device.entity";
import { DeviceRegisteration } from "../device/device.types";
import { DeviceStateMessage } from "../mqtt/mqtt.types";
import { Relay } from "./relay.entity";
import { relayRepository } from "./relay.repository";

export class RelayService {
    async updateRelayState(message: DeviceStateMessage): Promise<void> {
        await relayRepository.updateState(message.device_id, message.channel, message.state);
    }

    async syncRelays(device: Device, registration: DeviceRegisteration): Promise<void> {
        const firmwareChannels = new Set<number>();

        for(const relayRegistration of registration.relays){
            firmwareChannels.add(relayRegistration.channel);

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
            relay.enabled = true;
            await relayRepository.save(relay);
        }

        const existingRelays = await relayRepository.findAllByDeviceId(registration.deviceId);

        for (const relay of existingRelays){
            if(!firmwareChannels.has(relay.channel)){
                await relayRepository.updateConfiguration(relay, {
                    gpio: relay.gpio,
                    enabled: true
                })
                console.warn(`Relay ${relay.channel} disabled`);
            }
        }

        console.log(`Synchronized ${registration.relays.length} relays for ${registration.deviceId}`);
    }
}

export const relayService = new RelayService();