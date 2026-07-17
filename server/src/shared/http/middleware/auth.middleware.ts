import { NextFunction, Request, Response } from "express";
import { TokenProvider } from "../../core/security/token/token.provider";
import { UnauthorizedError } from "../../errors/unauthorized.error";

export class AuthMiddleware {
    constructor(
        private readonly tokenProvider: TokenProvider
    ){}

    authenticate = async(
        request: Request,
        _response: Response,
        next: NextFunction
    ): Promise<void> => {
        const authorization = request.header("Authorization");

        if(!authorization) throw new UnauthorizedError("Missing authorization header.");

        const [schema, token] = authorization.split(" ");

        if(schema !== "Bearer" || !token) throw new UnauthorizedError("Invalid authorization header.");

        const claims = await this.tokenProvider.verifyAccessToken(token);

        request.user = {
            id: claims.sub
        };
        next();
    }
}