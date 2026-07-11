import { Request, Response } from "express";
import { RelayService } from "../../../application/relay.service";
import { sendError, sendSuccess } from "../../../../../shared/http/api.response";
import { isSetRelayStateBody } from "../../../application/relay.validator";
import { Mapper } from "../../../../../shared/mapper/mapper";
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
    
        if(!deviceId){
            sendError(response, 400, "Device ID is required");
            return;
        }
    
        if(!Number.isInteger(channel) || channel < 1){
            sendError(response, 400, "Channel must be a positive integer");
            return;
        }
    
        if(!isSetRelayStateBody(request.body)){
            sendError(response, 400, "Body must contain a boolean state");
            return;
        }
    
        try{
            await this.relayService.requestRelayState(deviceId, channel, request.body.state);
    
            sendSuccess(
                response, 
                202, 
                "Relay command accepted", 
                {
                    deviceId,
                    channel,
                    requestedState: request.body.state
                }
            );

        }catch(error){
            const message = error instanceof Error
                ? error.message
                : "Relay command failed"
            
            sendError(
                response,
                message.includes("not found") ? 404 : 409,
                message
            );
        }
    }

    getRelays = async (
        request: Request,
        response: Response
    ): Promise<void> => {
        const {deviceId} = request.params;

        if(!deviceId){
            sendError(
                response,
                400,
                "Device Id is required"
            );
        }

        try{
            const relays = await this.relayService.getRelaysByDevice(deviceId as string);
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

        } catch(error) {
            sendError(
                response,
                500,
                error instanceof Error  ? error.message : "Failed to retrieve relays"
            );
        }
    }
}