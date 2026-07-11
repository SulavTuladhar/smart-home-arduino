import { Column, Entity } from "typeorm";
import { BaseEntity } from "../../database/entities/base.entity";

@Entity("relays")
export class Relay extends BaseEntity{
    @Column({
        name: "device_id"
    })
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