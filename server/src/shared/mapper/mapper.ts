export class Mapper {
    static map<TEntity, TDto>(
        entity: TEntity,
        mapper: (entity: TEntity) => TDto
    ): TDto{
        return mapper(entity);
    }

    static mapList<TEntity, TDto>(
        entities: TEntity[],
        mapper: (entity: TEntity) => TDto 
    ): TDto[] {
        return entities.map(mapper);
    }
}