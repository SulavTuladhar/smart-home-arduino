import dotenv from "dotenv";
import express from "express";
import "reflect-metadata";
import { Application } from "./app/application";
import { relayRouter } from "./modules/relays/presentation/http/relay.routes";
import { container } from "./app/container";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.use("/api", relayRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

const application = new Application(
  app, 
  Number(PORT),
  {
    mqttClient: container.infrastructure.mqttClient,
    monitors: [container.monitoring.deviceOfflineMonitor]
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