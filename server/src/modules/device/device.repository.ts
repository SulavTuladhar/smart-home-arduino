import { EntityManager, Repository } from "typeorm";
import { AppDataSource } from "../../database/data-source";
import { Device } from "./device.entity";

export class DeviceRepository {
    private readonly repository = AppDataSource.getRepository(Device);

    private getRepository(
        manager?: EntityManager
    ): Repository<Device>{
        if(manager) return manager.getRepository(Device);
        return this.repository;
    }

    async findByDeviceId(deviceId: string, manager?: EntityManager): Promise<Device | null> {
        return this.getRepository(manager).findOne({
            where: {
                deviceId
            }
        })
    }

    async save(device: Device, manager?: EntityManager): Promise<Device> {
        return this.getRepository(manager).save(device);
    }
}

export const deviceRepository = new DeviceRepository();
