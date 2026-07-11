import { Router } from "express";
import { RelayController } from "./relay.controller";

export class RelayRoutes {
    static create(
        controller: RelayController
    ): Router {
        const router = Router();

        router.post("/devices/:deviceId/relays/:channel/state", controller.setRelayState);
        
        return router
    }
}
