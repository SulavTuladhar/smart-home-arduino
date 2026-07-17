import { Router } from "express";
import { asyncHandler } from "../../../../../shared/http/middleware/async.handler";
import { DeviceController } from "../controllers/device.controller";
import { AuthMiddleware } from "../../../../../shared/http/middleware/auth.middleware";

export class DevicesRoutes {
    static create(
        controller: DeviceController,
        middleware: AuthMiddleware
    ): Router {
        const router = Router();

        router.get("/devices", 
            asyncHandler(middleware.authenticate),
            asyncHandler(controller.getDevices)
        );

        router.get("/devices/:deviceId", 
            middleware.authenticate,
            asyncHandler(controller.getDevice)
        );
        
        return router;
    }
}