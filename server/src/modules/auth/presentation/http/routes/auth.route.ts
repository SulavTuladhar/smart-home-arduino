import { Router } from "express";
import { asyncHandler } from "../../../../../shared/http/middleware/async.handler";
import { AuthController } from "../controllers/auth.controller";

export class AuthRoutes {
    static create(
        controller: AuthController
    ): Router {
        const router = Router();

        router.post("/register", 
            asyncHandler(controller.register.bind(controller))
        );
        
        return router;
    }
}