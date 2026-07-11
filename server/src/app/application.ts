import type { Express } from "express";
import type { Server } from "http";
import { AppDataSource } from "../database/data-source";
import { startMqttSubscriber } from "../infrastructure/mqtt/mqtt.subscriber";
import { container } from "./container";
import { ApplicationDependencies } from "./application.types";

export class Application {
    private server?: Server;

    constructor(
        private readonly app: Express,
        private readonly port: number,
        private readonly dependencies: ApplicationDependencies
    ){}

    async start(): Promise<void> {
        console.info("Starting application...");

        await AppDataSource.initialize();

        startMqttSubscriber(this.dependencies.mqttClient);

        for(const monitor of this.dependencies.monitors){
            monitor.start();
        }

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

        for(const monitor of this.dependencies.monitors){
            monitor.stop();
        }

        this.dependencies.mqttClient.end(true);

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