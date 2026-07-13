export interface AccessTokenClaims {
    sub: string;
    type: "access";
}

export interface RefreshTokenClaims {
    sub: string;
    type: "refresh";
}

export type AuthTokenClaims = 
    | AccessTokenClaims
    | RefreshTokenClaims;