import { Relay } from "../domain/relay.entity";
import { RelayResponseDto } from "../presentation/http/dto/relay.response.dto";

export class RelayMapper {
    static toResponse(
        relay: Relay
    ): RelayResponseDto {
        return {
            channel: relay.channel,
            name: relay.name,
            enabled: relay.enabled,
            desiredState: relay.desiredState,
            actuablState: relay.actualState
        }
    }
}