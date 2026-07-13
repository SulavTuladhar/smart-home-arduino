import { Router } from "express";
import { asyncHandler } from "../../../../../shared/http/middleware/async.handler";
import { DeviceController } from "../controllers/device.controller";

export class DevicesRoutes {
    static create(
        controller: DeviceController
    ): Router {
        const router = Router();

        router.get("/devices", 
            asyncHandler(controller.getDevices)
        );

        router.get("/devices/:deviceId", 
            asyncHandler(controller.getDevice)
        );
        
        return router;
    }
}