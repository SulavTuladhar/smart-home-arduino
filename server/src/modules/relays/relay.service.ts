import { DeviceStateMessage } from "../mqtt/mqtt.types";
import { relayRepository } from "./relay.repository";

export class RelayService {
    async updateRelayState(message: DeviceStateMessage): Promise<void> {
        await relayRepository.updateState(message.device_id, message.channel, message.state);
    }
}

export const relayService = new RelayService();