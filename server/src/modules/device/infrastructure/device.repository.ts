import { EntityManager } from "typeorm";
import { Device } from "../domain/device.entity";
import { BaseRepository } from "../../../database/repositories/base.repository";
import { AppDataSource } from "../../../database/data-source";

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
