import { DeviceRepository } from "./modules/device/device.repository";
import { DeviceService } from "./modules/device/device.service";
import { RelayRepository } from "./modules/relays/relay.repository";
import { RelayService } from "./modules/relays/relay.service";

const deviceRepository = new DeviceRepository();
const relayRepository = new RelayRepository();

const relayService = new RelayService(relayRepository);
const deviceService = new DeviceService(deviceRepository, relayService);

export const container = {
    repositories: {
        deviceRepository,
        relayRepository
    },
    services: {
        deviceService,
        relayService
    }
}