import { EntityManager, LessThan } from "typeorm";
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

    async updateHeartbeat(
        hardwareDeviceId: string,
        heartbeat: {
            uptime: number;
            freeHeap: number;
            wifiRssi: number;
        },
        manager?: EntityManager
    ): Promise<void>{
        const repository = this.getRepository(manager);

        const device = await repository.findOne({
            where: {
                deviceId: hardwareDeviceId
            }
        });

        if(!device){
            throw new Error(`Device ${hardwareDeviceId} not found`);
        }

        device.online = true;
        device.lastSeen = new Date();
        device.uptime = String(heartbeat.uptime);
        device.freeHeap = heartbeat.freeHeap;
        device.wifiRssi = heartbeat.wifiRssi;

        await repository.save(device);
    }

    async markDevicesOfflineBefore(
        threshold: Date,
        manager?: EntityManager
    ): Promise<number>{
        const repository = this.getRepository(manager);

        const result = await repository.update({
            online: true,
            lastSeen: LessThan(threshold)
        },{
            online: false
        });

        return result.affected ?? 0;
    }

    // http methods
    async findAll(
        manager?: EntityManager
    ): Promise<Device[]>{
        return this.getRepository(manager).find({
            order: {
                room: "ASC"
            }
        })
    }
}

export const deviceRepository = new DeviceRepository();
