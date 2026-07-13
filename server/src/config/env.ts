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
    MYSQL_HOST: z.string(),
    MYSQL_PORT: z.coerce.number(),
    MYSQL_USERNAME: z.string(),
    MYSQL_PASSWORD: z.string(),
    MYSQL_DATABASE: z.string(),
    MQTT_BROKER_HOST: z.string(),
    MQTT_BROKER_PORT: z.coerce.number(),
    JWT_SECRET: z.string(),
    JWT_ACCESS_EXPIRES_IN: z.string(),
    JWT_REFRESH_EXPIRES_IN: z.string(),
    BCRYPT_ROUNDS: z.coerce.number()
});

export const env = envSchema.parse(process.env);