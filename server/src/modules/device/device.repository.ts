import { AppDataSource } from "../../database/data-source";
import { Device } from "./device.entity";

export class DeviceRepository {
    private readonly repository = AppDataSource.getRepository(Device);

    async findByDeviceId(deviceId: string): Promise<Device | null> {
        return await this.repository.findOne({where: {deviceId}});
    }

    async save(device: Device): Promise<Device> {
        return await this.repository.save(device);
    }
}

export const deviceRepository = new DeviceRepository();
