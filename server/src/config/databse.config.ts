import { env } from "./env";

export const databaseConfig = {
    host: env.MYSQL_HOST,
    port: env.MYSQL_PORT,
    username: env.MYSQL_USERNAME,
    password: env.MYSQL_PASSWORD,
    database: env.MYSQL_DATABASE
} as const;