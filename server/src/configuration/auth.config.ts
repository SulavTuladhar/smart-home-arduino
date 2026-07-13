import { env } from "./env"

export const authConfig = {
    jwt: {
        secret: env.JWT_SECRET,
        accessExpiresIn: env.JWT_ACCESS_EXPIRES_IN,
        refreshExpiresIN: env.JWT_REFRESH_EXPIRES_IN
    },
    bcrypt: {
        rounds: env.BCRYPT_ROUNDS
    }
} as const;