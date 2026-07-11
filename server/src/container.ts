import { DeviceRepository } from "./modules/device/device.repository";
import { DeviceService } from "./modules/device/device.service";
import { MqttPublisher } from "./modules/mqtt/mqtt.publisher";
import { RelayController } from "./modules/relays/relay.controller";
import { RelayRepository } from "./modules/relays/relay.repository";
import { RelayService } from "./modules/relays/relay.service";

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