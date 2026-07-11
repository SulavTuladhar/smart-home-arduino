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

    async save(relay: Relay): Promise<Relay>{
        return this.repository.save(relay);
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
}

export const relayRepository = new RelayRepository();