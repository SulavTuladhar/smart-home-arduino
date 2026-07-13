import { AccessTokenClaims, RefreshTokenClaims } from "./token.claims";

export interface TokenPair {
    accessToken: string,
    refreshToken: string
}

export interface TokenProvider {
    generateAccessToken(userId: string): Promise<string>;

    generateRefreshToken(userId: string): Promise<string>;

    generateTokenPair(userId: string): Promise<TokenPair>;

    verifyAccessToken(token: string): Promise<AccessTokenClaims>;

    verifyRefreshToken(token: string): Promise<RefreshTokenClaims>;
}