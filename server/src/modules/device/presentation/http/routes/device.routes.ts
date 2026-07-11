import { Router } from "express";
import { DeviceController } from "../controllers/device.controller";

export class DevicesRoutes {
    static create(
        controller: DeviceController
    ): Router {
        const router = Router();

        router.get("/devices", controller.getDevices);
        router.get("/devices/:deviceId", controller.getDevice);
        return router;
    }
}