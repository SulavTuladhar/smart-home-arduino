import { EntityManager } from "typeorm";
import { BaseRepository } from "../../../database/repositories/base.repository";
import { User } from "../domain/user.entity";
import { AppDataSource } from "../../../database/data-source";

export class UserRepository extends BaseRepository<User>{
    constructor(){
        super(
            User,
            AppDataSource.getRepository(User)
        )
    }
    async findById(
        id: string,
        manager?: EntityManager
    ){
        return this.getRepository(manager).findOne({where: {id}});
    }

    async findByEmail(
        email: string,
        manager?: EntityManager
    ){
        return this.getRepository(manager).findOne({
            where: {email}
        })
    }
}