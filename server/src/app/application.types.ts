import type { MqttClient } from "mqtt";
import { TransactionManager } from "../infrastructure/database/transaction.manager";

export interface Startable {
    start(): void;
}

export interface Stoppable {
    stop(): void;
}

export interface ApplicationDependencies {
    mqttClient: MqttClient,
    monitors: Array<Startable & Stoppable>;
}

export interface ApplicationDatabase {
    transactionManager: TransactionManager
}