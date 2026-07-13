import { EntityManager } from "typeorm";
import { AppDataSource } from "../../../database/data-source";
import { BaseRepository } from "../../../database/repositories/base.repository";
import { Site } from "../domain/site.entity";

export class SiteRepository extends BaseRepository<Site>{
    constructor(){
        super(
            Site,
            AppDataSource.getRepository(Site)
        );
    }

    async findById(
        siteId: string,
        manager?: EntityManager
    ): Promise<Site | null> {
        return this.getRepository(manager).findOne({
            where: {
                id: siteId,
            },
            relations: {
                user: true
            }
        });
    }

    async findAllByUserId(
        userId: string,
        manager?: EntityManager
    ): Promise<Site[]>{
        return this.getRepository(manager).find({
            where: {
                user:{
                    id: userId
                }
            },
            relations: {
                user: true
            },
            order: {
                name: "ASC"
            }
        });
    }
}