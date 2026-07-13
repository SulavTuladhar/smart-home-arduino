export interface AuthConfig {
    bcrypt: {
        rounds: number;
    },
    jwt: {
        accessSecret: string;
        refreshSecret: string;
        accessExpiresIn: string;
        refreshExpiresIn: string;
        issuer: string;
        audience: string;
    }
}