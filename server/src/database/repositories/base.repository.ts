import { EntityManager, EntityTarget, ObjectLiteral, Repository } from "typeorm";

export abstract class BaseRepository<Entity extends ObjectLiteral>{
    private readonly defaultRepository: Repository<Entity>;

    protected constructor(
        private readonly entity: EntityTarget<Entity>,
        dataSourceRepository: Repository<Entity>
    ){
        this.defaultRepository = dataSourceRepository;
    }

    protected getRepository(manager?: EntityManager): Repository<Entity>{
        if(manager) return manager.getRepository(this.entity);
        return this.defaultRepository;
    }

    async save(entity: Entity, manager?: EntityManager): Promise<Entity>{
        return this.getRepository(manager).save(entity);
    }

    async remove(entity: Entity, manager?: EntityManager): Promise<void>{
        await this.getRepository(manager).remove(entity);
    }
}