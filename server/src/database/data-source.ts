import "reflect-metadata";
import { DataSource } from "typeorm";
import { databaseConfig } from "../configuration";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: databaseConfig.host,
  port: Number(databaseConfig.port),
  username: databaseConfig.username,
  password: databaseConfig.password,
  database: databaseConfig.database,
  synchronize: true,
  logging: false,
  entities: ["src/**/*.entity.ts"],
});
