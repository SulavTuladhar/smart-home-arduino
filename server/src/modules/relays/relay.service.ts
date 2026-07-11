
export class RelayService {
    // async updateRelayState(message: DeviceStateMessage): Promise<void> {
    //     await relayRepository.updateRelayState(message.device_id, message.channel, message.state);
    // }
}

export const relayService = new RelayService();