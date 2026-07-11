import type { MqttClient } from "mqtt";

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