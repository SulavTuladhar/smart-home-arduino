import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "../../../database/entities/base.entity";
import { Device } from "../../device/domain/device.entity";
import { User } from "../../user/domain/user.entity";

@Entity("sites")
export class Site extends BaseEntity {
    @Column()
    name!: string;

    @Column({
        type: "varchar",
        length: 30
    })
    type!: "home" | "shop" | "office";

    @ManyToOne(
        () => User,
        (user) => user.sites,
        {
            nullable: false,
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({
        name: "user_id"
    })
    user!: User;

    @OneToMany(
        () => Device,
        (device) => device.site
    )
    devices!: Device[];
}