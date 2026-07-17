import { EntityManager } from "typeorm";

export interface TransactionManager {
    execute<T>(
        work: (manager: EntityManager) => Promise<T>
    ): Promise<T>;
}