import { Request, Response } from "express";
import { isSetRelayStateBody } from "./relay.validator";
import { container } from "../../container";
import { RelayService } from "./relay.service";

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
            response
                .status(400)
                .json({
                    message: "Device ID is required"
                });
            return;
        }
    
        if(!Number.isInteger(channel) || channel < 1){
            response
                .status(400)
                .json({
                    message: "Channel must be a positive interger"
                });
            return;
        }
    
        if(!isSetRelayStateBody(request.body)){
            response    
                .status(400)
                .json({
                    message: "Body must contain a boolean state"
                });
            return;
        }
    
        try{
            await this.relayService.requestRelayState(deviceId, channel, request.body.state);
    
            response.status(202)
                .json({
                    message: "Relay command accepted",
                    deviceId,
                    channel,
                    requestedState: request.body.state
                })
        }catch(error){
            const message = error instanceof Error
                ? error.message
                : "Relay command failed"
            
            const status = message.includes("not found") ? 404 : 409;
            response.status(status).json({message})
        }
    }
}