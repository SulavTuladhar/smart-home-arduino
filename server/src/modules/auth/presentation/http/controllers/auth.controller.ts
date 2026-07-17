import { Request, Response } from "express";
import { AuthService } from "../../../application/auth.service";
import { sendSuccess } from "../../../../../shared/http/response/api.response";

export class AuthController {
    constructor(
        private readonly authService: AuthService
    ){}

    async register(
        request: Request,
        response: Response
    ): Promise<void> {
        const result = await this.authService.register(request.body);
        
        sendSuccess(
            response,
            201,
            "Registered successfully",
            result
        );
    }

    async login(
        request: Request,
        response: Response
    ): Promise<void> {
        const result = await this.authService.login(request.body);

        sendSuccess(
            response,
            200,
            "Logged in successfully",
            result
        )
    }
}