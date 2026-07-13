import { authConfig } from "../configuration";
import { DeviceOfflineMonitor } from "../infrastructure/monitoring/device.offline.monitor";
import { createMqttClient } from "../infrastructure/mqtt/mqtt.client";
import { MqttPublisher } from "../infrastructure/mqtt/mqtt.publisher";
import { DeviceService } from "../modules/device/application/device.service";
import { DeviceRepository } from "../modules/device/infrastructure/device.repository";
import { DeviceController } from "../modules/device/presentation/http/controllers/device.controller";
import { RelayService } from "../modules/relays/application/relay.service";
import { RelayRepository } from "../modules/relays/infrastructure/relay.repository";
import { RelayController } from "../modules/relays/presentation/http/controllers/relay.controller";
import { SiteService } from "../modules/site/application/site.service";
import { SiteRepository } from "../modules/site/infrastructure/site.repository";
import { UserRepository } from "../modules/user/infrastructure/user.repository";
import { BcryptPasswordHasher } from "../shared/core/security/password/bcrypt.password.hasher";
import { PasswordHasher } from "../shared/core/security/password/password.hasher";
import { JwtTokenProvider } from "../shared/core/security/token/jwt.token.provider";
import { TokenProvider } from "../shared/core/security/token/token.provider";
import { Clock } from "../shared/core/time/clock";
import { SystemClock } from "../shared/core/time/system.clock";

export class ApplicationContainer {

    core!: {
        clock: Clock,
        passwordHasher: PasswordHasher;
        tokenProvider: TokenProvider
    };

    repositories!: {
        deviceRepository: DeviceRepository,
        relayRepository: RelayRepository,
        siteRepository: SiteRepository,
        userRepository: UserRepository
    };

    services!: {
        deviceService: DeviceService,
        relayService: RelayService,
        siteService: SiteService
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
        this.initilizeCore();
        this.initilizeRepositories();
        this.initializeInfrastructures();
        this.initializeServices();
        this.initalizeControllers();
        this.initializeMonitoring();
    }

    private initilizeCore(): void {
        this.core = {
            clock: new SystemClock(),
            passwordHasher: new BcryptPasswordHasher(authConfig.bcrypt.rounds),
            tokenProvider: new JwtTokenProvider()
        }
    }

    private initilizeRepositories(): void {
        this.repositories = {
            deviceRepository: new DeviceRepository(),
            relayRepository: new RelayRepository(),
            siteRepository: new SiteRepository(),
            userRepository: new UserRepository()
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
        const siteService = new SiteService(this.repositories.siteRepository, this.repositories.userRepository);

        this.services = {
            relayService,
            deviceService,
            siteService
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