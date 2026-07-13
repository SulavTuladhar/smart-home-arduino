import { AuthConfig } from "./auth.config.interface";
import { env } from "./env";

export const authConfig: AuthConfig = {
    bcrypt: {
        rounds: env.BCRYPT_ROUNDS
    },
    jwt: {
        accessSecret: env.JWT_ACCESS_SECRET,
        refreshSecret: env.JWT_REFRESH_SECRET,
        accessExpiresIn: env.JWT_ACCESS_EXPIRES_IN,
        refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
        issuer: env.JWT_ISSUER,
        audience: env.JWT_AUDIENCE
    },
};


