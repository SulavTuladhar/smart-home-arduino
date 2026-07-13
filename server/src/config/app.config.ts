import { env } from "./env";

export const appConfig = {
    port: env.PORT,
    environment: env.NODE_ENV
}