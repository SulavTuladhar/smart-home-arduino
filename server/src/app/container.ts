import { MqttPublisher } from "../infrastructure/mqtt/mqtt.publisher";
import { DeviceService } from "../modules/device/application/device.service";
import { DeviceRepository } from "../modules/device/infrastructure/device.repository";
import { RelayService } from "../modules/relays/application/relay.service";
import { RelayRepository } from "../modules/relays/infrastructure/relay.repository";
import { RelayController } from "../modules/relays/presentation/http/relay.controller";

const deviceRepository = new DeviceRepository();
const relayRepository = new RelayRepository();

const mqttPublisher = new MqttPublisher();

const relayService = new RelayService(relayRepository, mqttPublisher);
const deviceService = new DeviceService(deviceRepository, relayService);

const relayController = new RelayController(relayService);

export const container = {
    repositories: {
        deviceRepository,
        relayRepository
    },
    services: {
        deviceService,
        relayService
    },
    controllers: {
        relayController
    },
    infrastructure: {
        mqttPublisher
    }
}