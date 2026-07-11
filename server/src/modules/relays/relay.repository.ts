import { EntityManager, Repository } from "typeorm";
import { AppDataSource } from "../../database/data-source";
import { Relay } from "./relay.entity";
import { RelaySyncConfiguration } from "./relay.types";

export class RelayRepository {
    private readonly repository = AppDataSource.getRepository(Relay);

    private getRepository(manager?: EntityManager): Repository<Relay>{
        if(manager) return manager.getRepository(Relay);
        return this.repository;
    }

    async findByDeviceAndChannel(hardwareDeviceId: string, channel: number, manager?: EntityManager): Promise<Relay | null>{
        return this.getRepository(manager).findOne({
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

    async findAllByDeviceId(hardwareDeviceId: string, manager?: EntityManager): Promise<Relay[]>{
        return this.getRepository(manager).find({
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

    async save(relay: Relay, manager?: EntityManager): Promise<Relay>{
        return this.getRepository(manager).save(relay);
    }

    async updateState(hardwareDeviceId: string, channel: number, state: boolean, manager?: EntityManager): Promise<void>{
        const relay = await this.findByDeviceAndChannel(hardwareDeviceId, channel, manager);

        if(!relay){
            throw new Error(`Relay ${channel} not found for device ${hardwareDeviceId}`);
        }

        relay.acutalState = state;
        await this.getRepository(manager).save(relay);
    }

    async remove(relay: Relay, manager?: EntityManager): Promise<void>{
        await this.getRepository(manager).remove(relay);
    }

    async updateConfiguration(relay: Relay, configuration: RelaySyncConfiguration, manager?: EntityManager): Promise<Relay> {
        relay.gpio = configuration.gpio;
        relay.enabled = configuration.enabled;

        return await this.getRepository(manager).save(relay);
    }
}

export const relayRepository = new RelayRepository();