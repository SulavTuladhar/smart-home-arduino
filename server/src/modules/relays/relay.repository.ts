import { AppDataSource } from "../../database/data-source";
import { Relay } from "./relay.entity";

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

    async findAllByDeviceId(deviceId: string): Promise<Relay[]>{
        return this.repository.find({
            where: {
                deviceId
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
}

export const relayRepository = new RelayRepository();