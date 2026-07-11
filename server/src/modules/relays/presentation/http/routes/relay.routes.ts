import { Router } from "express";
import { RelayController } from "../controllers/relay.controller";

export class RelayRoutes {
    static create(
        controller: RelayController
    ): Router {
        const router = Router();

        router.get("/devices/:deviceId/relays", controller.getRelays);

        router.post("/devices/:deviceId/relays/:channel/state", controller.setRelayState);        
        return router
    }
}
