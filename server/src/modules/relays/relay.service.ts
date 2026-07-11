import { EntityManager } from "typeorm";
import { Device } from "../device/device.entity";
import { DeviceRegisteration } from "../device/device.types";
import { DeviceStateMessage } from "../mqtt/mqtt.types";
import { Relay } from "./relay.entity";
import { relayRepository } from "./relay.repository";

export class RelayService {
    async updateRelayState(message: DeviceStateMessage): Promise<void> {
        await relayRepository.updateState(message.device_id, message.channel, message.state);
    }

    async syncRelays(device: Device, registration: DeviceRegisteration, manager?: EntityManager): Promise<void> {
        const firmwareChannels = new Set<number>(registration.relays.map(relay => relay.channel));

        for(const relayRegistration of registration.relays){
            await this.syncReportedRelay(device, registration.deviceId, relayRegistration, manager);

            await this.disableMissingRelays(registration.deviceId, firmwareChannels, manager);
        }
        console.log(`Synchronized ${registration.relays.length} relays for ${registration.deviceId}`);
    }

    private async syncReportedRelay(device: Device, hardwareDeviceId: string, relayRegistration: {channel: number, gpio: number}, manager?: EntityManager): Promise<void>{
        let existingRelay = await relayRepository.findByDeviceAndChannel(hardwareDeviceId, relayRegistration.channel, manager);

        if(!existingRelay){
            await this.createRelay(device, relayRegistration, manager);
            return;
        }

        await this.updateExisitingRelay(existingRelay, relayRegistration.gpio, manager);
    }

    private async createRelay(device: Device, relayRegistration: {channel: number, gpio: number}, manager?: EntityManager): Promise<void>{
        const relay = new Relay();

        relay.device = device;
        relay.channel = relayRegistration.channel;
        relay.gpio = relayRegistration.gpio;
        relay.name = `Relay-${relayRegistration.channel}`;
        relay.enabled = true;
        relay.desiredState = false;
        relay.actualState = false;

        await relayRepository.save(relay, manager);
        console.info(`Created relay ${relay.channel} on GPIO ${relay.gpio}`);
    }

    private async updateExisitingRelay(relay: Relay, gpio: number, manager?: EntityManager): Promise<void>{
        await relayRepository.updateConfiguration(relay, {
            gpio,
            enabled: true
        }, manager);
        console.info(`Updated relay ${relay.channel}: GPIO ${gpio}, enabled`);
    }

    private async disableMissingRelays(hardwareDeviceId: string, firmwareChannels: Set<number>, manager?: EntityManager): Promise<void>{
        let existingRelays = await relayRepository.findAllByDeviceId(hardwareDeviceId, manager);

        for(const relay of existingRelays){
            if(firmwareChannels.has(relay.channel)) continue;
            if(!relay.enabled) continue;
            await relayRepository.updateConfiguration(relay, {
                gpio: relay.gpio,
                enabled: false
            }, manager);
            console.warn(`Disabled relay ${relay.channel}`);
        }
    }


}

export const relayService = new RelayService();