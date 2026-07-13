import dotenv from "dotenv";
import z from "zod";

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z 
        .enum([
            "development",
            "production",
            "test"
        ])
        .default("development"),
    PORT: z.coerce.number().default(3000),
    DB_HOST: z.string(),
    DB_PORT: z.coerce.number(),
    DB_USERNAME: z.string(),
    DB_PASSWORD: z.string(),
    DB_NAME: z.string(),
    MQTT_BROKER_HOST: z.string(),
    MQTT_BROKER_PORT: z.coerce.number(),
    JWT_ACCESS_SECRET: z.string().min(32, "JWT_ACCESS_SECRET must contain at least 32 characters"),
    JWT_REFRESH_SECRET: z.string().min(32, "JWT_REFRESH_SECRET must contain at least 32 characters"),
    JWT_ACCESS_EXPIRES_IN: z.string().min(1),
    JWT_REFRESH_EXPIRES_IN: z.string().min(1),
    JWT_ISSUER: z.string().min(1),
    JWT_AUDIENCE: z.string().min(1),
    BCRYPT_ROUNDS: z.coerce.number().int().min(4).max(15)
});

export const env = envSchema.parse(process.env);