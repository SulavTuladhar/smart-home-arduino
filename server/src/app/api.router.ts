import { Router } from "express";
import { ApplicationContainer } from "./application.container";
import { DevicesRoutes } from "../modules/device/presentation/http/routes/device.routes";
import { RelayRoutes } from "../modules/relays/presentation/http/routes/relay.routes";
import { AuthRoutes } from "../modules/auth/presentation/http/routes/auth.route";

export class ApiRouter {
    static create(
        container: ApplicationContainer
    ): Router {
        const router = Router();

        router.use("/device", DevicesRoutes.create(container.controllers.deviceController));
        router.use("/relay", RelayRoutes.create(container.controllers.relayController));
        router.use("/auth", AuthRoutes.create(container.controllers.authController));

        return router;
    }
}