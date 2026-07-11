import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "../../../database/entities/base.entity";
import { Relay } from "../../relays/domain/relay.entity";

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

    @Column({
        name: "last_seen",
        type: "datetime",
        nullable: true
    })
    lastSeen!: Date | null;

    @Column({
        type: "bigint",
        default: 0
    })
    uptime!: string;

    @Column({
        name: "free_heap",
        type: "int",
        default: 0
    })
    freeHeap!: number;

    @Column({
        name: "wifi_rssi",
        type: "int",
        default: 0
    })
    wifiRssi!: number | null

    @OneToMany(() => Relay, (relay) => relay.deviceId)
    relays!: Relay[];
}
