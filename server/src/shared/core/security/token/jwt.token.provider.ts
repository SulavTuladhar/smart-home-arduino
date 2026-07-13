import { TokenProvider } from "./token.provider";

export class JwtTokenProvider implements TokenProvider{
    async generateAccessToken(userId: string): Promise<string> {
        throw new Error("Not Implemented")
    }

    async generateRefreshToken(userId: string): Promise<string> {
        throw new Error("Not Implemented")
    }

    async verifyAccessToken<T>(token: string): Promise<T> {
        throw new Error("Not Implemented")
    }
}