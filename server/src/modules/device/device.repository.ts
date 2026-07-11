import { EntityManager } from "typeorm";
import { BaseRepository } from "../../database/base.repository";
import { AppDataSource } from "../../database/data-source";
import { Device } from "./device.entity";

export class DeviceRepository extends BaseRepository<Device>{
    constructor(){
        super(
            Device,
            AppDataSource.getRepository(Device)
        )
    }

    async findByDeviceId(deviceId: string, manager?: EntityManager): Promise<Device | null> {
        return this.getRepository(manager).findOne({
            where: {
                deviceId
            }
        })
    }
}

export const deviceRepository = new DeviceRepository();
