import { Request, Response } from "express";
import { sendSuccess } from "../../../../../shared/http/response/api.response";
import { Mapper } from "../../../../../shared/mapper/mapper";
import { RelayService } from "../../../application/relay.service";
import { RelayMapper } from "../../../mappers/relay.mapper";

export class RelayController {
    constructor(
        private readonly relayService: RelayService
    ){}

    setRelayState = async (
        request: Request,
        response: Response
    ): Promise<void> => {
        const deviceId = request.params.deviceId as string;
        const channel = Number(request.params.channel);
        const state = request.body.state as boolean;
    
        await this.relayService.requestRelayState(deviceId, channel, request.body.state);

        sendSuccess(
            response, 
            202, 
            "Relay command accepted", 
            {
                deviceId,
                channel,
                requestedState: state
            }
        );
    }

    getRelays = async (
        request: Request,
        response: Response
    ): Promise<void> => {
        const relays = await this.relayService.getRelaysByDevice(request.params.deviceId as string);
        const responseObj = Mapper.mapList(
            relays,
            RelayMapper.toResponse
        );
        sendSuccess(
            response,
            200,
            "Relays retrived successfully",
            responseObj
        );
    }

    updateRelay = async (
        request: Request,
        response: Response
    ): Promise<void> => {
        const { deviceId, channel } = request.params;

        const relay = await this.relayService.updatRelayDetails(deviceId as string, Number(channel), request.body);

        const responseObj = RelayMapper.toResponse(relay);

        sendSuccess(
            response, 
            200,
            "Relay updated successfully",
            responseObj
        )
    }
}