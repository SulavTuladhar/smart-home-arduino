import { Column, Entity } from "typeorm";
import { BaseEntity } from "../../database/entities/base.entity";

@Entity("devices")
export class Device extends BaseEntity{
    @Column({
        name: "device_id",
        unique: true
    })
    deviceId!: string;

    @Column()
    room!: string;

    @Column({
        name: "relay_count"
    })
    relayCount!: number;

    @Column({
        default: true
    })
    online!: boolean;
}