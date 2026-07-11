import { DeviceOfflineMonitor } from "../infrastructure/monitoring/device.offline.monitor";
import { createMqttClient } from "../infrastructure/mqtt/mqtt.client";
import { MqttPublisher } from "../infrastructure/mqtt/mqtt.publisher";
import { DeviceService } from "../modules/device/application/device.service";
import { DeviceRepository } from "../modules/device/infrastructure/device.repository";
import { DeviceController } from "../modules/device/presentation/http/controllers/device.controller";
import { RelayService } from "../modules/relays/application/relay.service";
import { relayRepository, RelayRepository } from "../modules/relays/infrastructure/relay.repository";
import { RelayController } from "../modules/relays/presentation/http/relay.controller";

export class ApplicationContainer {
    repositories!: {
        deviceRepository: DeviceRepository,
        relayRepository: RelayRepository
    };

    services!: {
        deviceService: DeviceService,
        relayService: RelayService
    }

    controllers!: {
        deviceController: DeviceController,
        relayController: RelayController
    }

    infrastructures!: {
        mqttClient: ReturnType<typeof createMqttClient>;
        mqttPublisher: MqttPublisher
    }

    monitoring!: {
        deviceOfflineMonitor: DeviceOfflineMonitor
    }

    constructor(){
        this.initizeRepositories();
        this.initializeInfrastructures();
        this.initializeServices();
        this.initalizeControllers();
        this.initializeMonitoring();
    }

    private initizeRepositories(): void {
        this.repositories = {
            deviceRepository: new DeviceRepository(),
            relayRepository: new RelayRepository()
        };
    }

    private initializeInfrastructures(): void {
        const mqttClient = createMqttClient();
        this.infrastructures = {
            mqttClient,
            mqttPublisher: new MqttPublisher(mqttClient)
        }
    }

    private initializeServices(): void {
        const relayService = new RelayService(
            this.repositories.relayRepository,
            this.infrastructures.mqttPublisher
        );
        const deviceService = new DeviceService(this.repositories.deviceRepository, relayService);

        this.services = {
            relayService,
            deviceService
        }
    }

    private initalizeControllers(): void {
        this.controllers = {
            relayController: new RelayController(this.services.relayService),
            deviceController: new DeviceController(this.services.deviceService)
        }
    }

    private initializeMonitoring(): void {
        this.monitoring = {
            deviceOfflineMonitor: new DeviceOfflineMonitor(this.services.deviceService)
        }
    }

}