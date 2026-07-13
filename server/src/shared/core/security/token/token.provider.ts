export interface TokenProvider {
    generateAccessToken(userId: string): Promise<string>;

    generateRefreshToken(userId: string): Promise<string>;

    verifyAccessToken<T>(token: string): Promise<T>;
}