import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "../../../database/entities/base.entity";
import { Site } from "../../site/domain/site.entity";

@Entity("users")
export class User extends BaseEntity {
    @Column()
    name!: string;

    @Column({
        unique: true
    })
    email!: string;

    @Column({
        name: "password_hash"
    })
    passwordHash!: string;

    @OneToMany(
        () => Site,
        (site) => site.user
    )
    sites!: Site[];
}