import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "../../database/entities/base.entity";
import { Relay } from "../relays/relay.entity";

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

    @OneToMany(() => Relay, (relay) => relay.deviceId)
    relays!: Relay[];
}