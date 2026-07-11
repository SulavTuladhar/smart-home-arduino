import type { Express } from "express";
import type { Server } from "http";
import { AppDataSource } from "../database/data-source";
import { startMqttSubscriber } from "../infrastructure/mqtt/mqtt.subscriber";
import { container } from "./container";

export class Application {
    private server?: Server;

    constructor(
        private readonly app: Express,
        private readonly port: number
    ){}

    async start(): Promise<void> {
        console.info("Starting application...");
        await AppDataSource.initialize();

        startMqttSubscriber(container.infrastructure.mqttClient);

        container.infrastructure.deviceOfflineMonitor.start();

        await new Promise<void>((resolve) => {
            this.server = this.app.listen(
                this.port,
                "0.0.0.0",
                () => {
                    console.info(`HTTP server listening on ${this.port}`);
                }
            );
            resolve();
        });

        console.info("Application started");
    }

    async stop(): Promise<void>{
        console.info("Stopping application...");

        container.infrastructure.deviceOfflineMonitor.stop();

        container.infrastructure.mqttClient.end(true);

        if(this.server){
            await new Promise<void>((resolve, reject) => {
                this.server!.close((error) => {
                    if(error){
                        reject(error);
                        return;
                    }

                    resolve();
                });
            });
        }

        if(AppDataSource.isInitialized){
            await AppDataSource.destroy();
        }
    }
}