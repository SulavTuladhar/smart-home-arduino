import jwt, { JwtPayload, SignOptions, VerifyOptions } from "jsonwebtoken";
import { AuthConfig } from "../../../../configuration";
import { AccessTokenClaims, RefreshTokenClaims } from "./token.claims";
import { TokenPair, TokenProvider } from "./token.provider";

export class JwtTokenProvider implements TokenProvider{
    constructor(
        private readonly config: AuthConfig["jwt"]
    ){}

    async generateAccessToken(userId: string): Promise<string> {
        const claims: AccessTokenClaims = {
            sub: userId,
            type: "access"
        };

        return jwt.sign(
            claims,
            this.config.accessSecret,
            this.createSignOptions(this.config.accessExpiresIn)
        );
    }

    async generateRefreshToken(userId: string): Promise<string> {
        const claims: RefreshTokenClaims = {
            sub: userId,
            type: "refresh"
        };

        return jwt.sign(
            claims,
            this.config.refreshSecret,
            this.createSignOptions(this.config.refreshExpiresIn)
        )
    }

    async generateTokenPair(userId: string): Promise<TokenPair> {
        const [accessToken, refreshToken] = await Promise.all([
            this.generateAccessToken(userId),
            this.generateRefreshToken(userId),
        ]);

        return {
            accessToken,
            refreshToken
        }
    }

    async verifyAccessToken(token: string): Promise<AccessTokenClaims> {
        const payload = jwt.verify(token, this.config.accessSecret, this.createVerifyOptions());

        return this.validateAccessClaims(payload);
    }

    async verifyRefreshToken(token: string): Promise<RefreshTokenClaims> {
        const payload = jwt.verify(token, this.config.refreshSecret, this.createVerifyOptions());

        return this.validateRefreshClaims(payload);
    }

    private createSignOptions(
        expiresIn: string
    ): SignOptions {
        return {
            algorithm: "HS256",
            expiresIn: expiresIn as SignOptions["expiresIn"],
            issuer: this.config.issuer,
            audience: this.config.audience
        }
    }

    private createVerifyOptions(): VerifyOptions {
        return {
            algorithms: ["HS256"],
            issuer: this.config.issuer,
            audience: this.config.audience
        }
    }

    private validateAccessClaims(payload: string | JwtPayload): AccessTokenClaims {
        if(typeof payload === "string" || typeof payload.sub !== "string" || payload.type !== "access"){
            throw new Error("Invalid access token payload");
        }

        return {
            sub: payload.sub,
            type: "access"
        }
    }

    private validateRefreshClaims(payload: string | JwtPayload): RefreshTokenClaims {
        if(typeof payload === "string" || typeof payload.sub !== "string" || payload.type !== "refresh"){
            throw new Error("Invalid refresh token payload");
        }

        return {
            sub: payload.sub,
            type: "refresh"
        }
    }
}