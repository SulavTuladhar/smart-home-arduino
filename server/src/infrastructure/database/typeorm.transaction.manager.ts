import { DataSource, EntityManager } from "typeorm";
import { TransactionManager } from "./transaction.manager";

export class TypeOrmTransactionManager implements TransactionManager {
    constructor(
        private readonly dataSource: DataSource
    ){}

    execute<T>(work: (manager: EntityManager) => Promise<T>): Promise<T> {
        return this.dataSource.transaction(work);
    }
}