import { Router } from "express";
import { asyncHandler } from "../../../../../shared/http/middleware/async.handler";
import { validateRequest } from "../../../../../shared/http/middleware/validate.request";
import { RelayController } from "../controllers/relay.controller";
import { relayParamsSchema, setRelayStateBodySchema, updateRelayBodySchema } from "../validation/relay.validation";

export class RelayRoutes {
    static create(
        controller: RelayController
    ): Router {
        const router = Router();

        router.get("/devices/:deviceId/relays", 
            validateRequest({
                params: relayParamsSchema,
                body: setRelayStateBodySchema
            }),
            asyncHandler(controller.getRelays),
        );

        router.post("/devices/:deviceId/relays/:channel/state", 
            validateRequest({
                params: relayParamsSchema,
                body: setRelayStateBodySchema
            }),
            asyncHandler(controller.setRelayState)
        );        

        router.patch("/devices/:deviceId/relays/:channel",
            validateRequest({
                params: relayParamsSchema,
                body: updateRelayBodySchema
            }),
            asyncHandler(controller.updateRelay)
        );

        return router
    }
}
