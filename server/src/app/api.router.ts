import { Router } from "express";
import { ApplicationContainer } from "./application.container";
import { DevicesRoutes } from "../modules/device/presentation/http/routes/device.routes";
import { RelayRoutes } from "../modules/relays/presentation/http/routes/relay.routes";

export class ApiRouter {
    static create(
        container: ApplicationContainer
    ): Router {
        const router = Router();

        router.use(DevicesRoutes.create(container.controllers.deviceController));
        router.use(RelayRoutes.create(container.controllers.relayController));

        return router;
    }
}