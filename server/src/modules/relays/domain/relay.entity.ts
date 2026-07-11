import { Column, Entity, JoinColumn, ManyToOne, RelationId } from "typeorm";
import { BaseEntity } from "../../../database/entities/base.entity";
import { Device } from "../../device/domain/device.entity";

@Entity("relays")
export class Relay extends BaseEntity{
    @ManyToOne(
        () => Device, 
        (device) => device.relays, 
        {
        nullable: false,
        onDelete: "CASCADE"
    })
    @JoinColumn({name: 'device_id'})
    device!: Device;

    @RelationId((relay: Relay) => relay.device)
    deviceId!: string;

    @Column()
    channel!: number;

    @Column()
    gpio!: number;

    @Column({
        default: ""
    })
    name!: string;

    @Column({
        default: true
    })
    enabled!: boolean;

    @Column({
        name: "desired_state",
        default: false
    })
    desiredState!: boolean;

    @Column({
        name: "actual_state",
        default: false
    })
    actualState!: boolean;

}