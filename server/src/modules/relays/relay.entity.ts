import { Column, Entity, JoinColumn, ManyToOne, RelationId } from "typeorm";
import { BaseEntity } from "../../database/entities/base.entity";
import { Device } from "../device/device.entity";

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
        name: "desired_state",
        default: false
    })
    desiredState!: boolean;

    @Column({
        name: "acutal_state",
        default: false
    })
    acutalState!: boolean;

}