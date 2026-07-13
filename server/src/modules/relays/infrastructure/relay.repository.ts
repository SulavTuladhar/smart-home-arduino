import { EntityManager } from "typeorm";
import { Relay } from "../domain/relay.entity";
import { AppDataSource } from "../../../database/data-source";
import { RelaySyncConfiguration } from "../domain/relay.types";
import { BaseRepository } from "../../../database/repositories/base.repository";
import { NotFoundError } from "../../../shared/errors/not.found.error";

export class RelayRepository extends BaseRepository<Relay> {
    constructor(){
        super(
            Relay,
            AppDataSource.getRepository(Relay)
        )
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

    async updateState(hardwareDeviceId: string, channel: number, state: boolean, manager?: EntityManager): Promise<void>{
        const relay = await this.findByDeviceAndChannel(hardwareDeviceId, channel, manager);

        if(!relay){
            throw new NotFoundError(`Relay ${channel} not found for device ${hardwareDeviceId}`)
        }

        relay.actualState = state;
        await this.save(relay, manager);
    }

    async updateConfiguration(relay: Relay, configuration: RelaySyncConfiguration, manager?: EntityManager): Promise<Relay> {
        relay.gpio = configuration.gpio;
        relay.enabled = configuration.enabled;

        return await this.save(relay, manager);
    }

    async findByDeviceId(
        hardwareDeviceId: string,
        manager?: EntityManager
    ): Promise<Relay[]> {
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
}

export const relayRepository = new RelayRepository();