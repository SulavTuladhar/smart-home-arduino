import { EntityManager } from "typeorm";
import { MqttPublisher } from "../../../infrastructure/mqtt/mqtt.publisher";
import { DeviceStateMessage } from "../../../infrastructure/mqtt/mqtt.types";
import { ConflictError } from "../../../shared/errors/conflict.error";
import { NotFoundError } from "../../../shared/errors/not.found.error";
import { Device } from "../../device/domain/device.entity";
import { DeviceRegisteration } from "../../device/domain/device.types";
import { Relay } from "../domain/relay.entity";
import { RelayRepository } from "../infrastructure/relay.repository";

export class RelayService {
    constructor(
        private readonly relayRepository: RelayRepository,
        private readonly mqttPublisher: MqttPublisher
    ){}

    async updateRelayState(message: DeviceStateMessage): Promise<void> {
        await this.relayRepository.updateState(message.device_id, message.channel, message.state);
    }

    async syncRelays(
        device: Device, registration: 
        DeviceRegisteration, 
        manager?: EntityManager
    ): Promise<void> {
        const firmwareChannels = new Set<number>(registration.relays.map(relay => relay.channel));

        for(const relayRegistration of registration.relays){
            await this.syncReportedRelay(device, registration.deviceId, relayRegistration, manager);

            await this.disableMissingRelays(registration.deviceId, firmwareChannels, manager);
        }
        console.info(`Synchronized ${registration.relays.length} relays for ${registration.deviceId}`);
    }

    private async syncReportedRelay(
        device: Device, 
        hardwareDeviceId: string, 
        relayRegistration: {
            channel: number, 
            gpio: number
        }, 
        manager?: EntityManager
    ): Promise<void>{
        let existingRelay = await this.relayRepository.findByDeviceAndChannel(hardwareDeviceId, relayRegistration.channel, manager);

        if(!existingRelay){
            await this.createRelay(device, relayRegistration, manager);
            return;
        }

        await this.updateExisitingRelay(existingRelay, relayRegistration.gpio, manager);
    }

    private async createRelay(
        device: Device, 
        relayRegistration: {
            channel: number, 
            gpio: number
        }, 
        manager?: EntityManager
    ): Promise<void>{
        const relay = new Relay();

        relay.device = device;
        relay.channel = relayRegistration.channel;
        relay.gpio = relayRegistration.gpio;
        relay.name = `Relay-${relayRegistration.channel}`;
        relay.enabled = true;
        relay.desiredState = false;
        relay.actualState = false;

        await this.relayRepository.save(relay, manager);
        console.info(`Created relay ${relay.channel} on GPIO ${relay.gpio}`);
    }

    private async updateExisitingRelay(
        relay: Relay, 
        gpio: number, 
        manager?: EntityManager
    ): Promise<void>{
        await this.relayRepository.updateConfiguration(relay, {
            gpio,
            enabled: true
        }, manager);
        console.info(`Updated relay ${relay.channel}: GPIO ${gpio}, enabled`);
    }

    private async disableMissingRelays(
        hardwareDeviceId: string, 
        firmwareChannels: Set<number>, 
        manager?: EntityManager
    ): Promise<void>{
        let existingRelays = await this.relayRepository.findAllByDeviceId(hardwareDeviceId, manager);

        for(const relay of existingRelays){
            if(firmwareChannels.has(relay.channel)) continue;
            if(!relay.enabled) continue;
            await this.relayRepository.updateConfiguration(relay, {
                gpio: relay.gpio,
                enabled: false
            }, manager);
            console.warn(`Disabled relay ${relay.channel}`);
        }
    }

    async requestRelayState(
        hardwareDeviceId: string,
        channel: number,
        state: boolean
    ): Promise<void>{
        const relay = await this.relayRepository.findByDeviceAndChannel(hardwareDeviceId, channel);

        if(!relay){
            throw new NotFoundError(`Relay ${channel} not found for device ${hardwareDeviceId}`)
        }
        if(!relay.enabled){
            throw new ConflictError(`Relay ${channel} is disabled`)
        }

        relay.desiredState = state;

        await this.relayRepository.save(relay);

        await this.mqttPublisher.publishRelayCommand(
            relay.device.room,
            {
                channel,
                state
            }
        );
    }

    async getRelaysByDevice(
        deviceId: string
    ): Promise<Relay[]>{
        return this.relayRepository.findAllByDeviceId(deviceId);
    }
}