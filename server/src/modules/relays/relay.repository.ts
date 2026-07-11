import { AppDataSource } from "../../database/data-source";
import { Relay } from "./relay.entity";
import { RelaySyncConfiguration } from "./relay.types";

export class RelayRepository {
    private readonly repository = AppDataSource.getRepository(Relay);

    async findByDeviceAndChannel(hardwareDeviceId: string, channel: number): Promise<Relay | null>{
        return this.repository.findOne({
            where: {
                device: {
                    deviceId: hardwareDeviceId
                },
                channel
            },
            relations: {
                device: true
            }
        });
    }

    async findAllByDeviceId(hardwareDeviceId: string): Promise<Relay[]>{
        return this.repository.find({
            where: {
                device: {
                    deviceId: hardwareDeviceId
                }
            },
            relations: {
                device: true
            },
            order: {
                channel: "ASC"
            }
        });
    }

    async save(relay: Relay): Promise<Relay>{
        return this.repository.save(relay);
    }

    async updateState(hardwareDeviceId: string, channel: number, state: boolean): Promise<void>{
        const relay = await this.findByDeviceAndChannel(hardwareDeviceId, channel);

        if(!relay){
            throw new Error(`Relay ${channel} not found for device ${hardwareDeviceId}`);
        }

        relay.acutalState = state;
        await this.repository.save(relay);
    }

    async remove(relay: Relay): Promise<void>{
        await this.repository.remove(relay);
    }

    async updateConfiguration(relay: Relay, configuration: RelaySyncConfiguration): Promise<Relay> {
        relay.gpio = configuration.gpio;
        relay.enabled = configuration.enabled;

        return await this.repository.save(relay);
    }
}

export const relayRepository = new RelayRepository();