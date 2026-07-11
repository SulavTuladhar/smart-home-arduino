import dotenv from "dotenv";
import express from "express";
import "reflect-metadata";
import { Application } from "./app/application";
import { ApplicationContainer } from "./app/application.container";
import { ApiRouter } from "./app/api.router";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

const container = new ApplicationContainer();

app.use(express.json());

app.use("/api", ApiRouter.create(container));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

const application = new Application(
  app, 
  Number(PORT),
  {
    mqttClient: container.infrastructures.mqttClient,
    monitors: Object.values(container.monitoring)
  }
);

application.start().catch(error => {
  console.error(error);
  process.exit(1);
})

async function shutdown(): Promise<void>{
  try{
    await application.stop();
    process.exit(0);
  } catch(error) {
    console.error(error);
    process.exit(1);
  }
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);