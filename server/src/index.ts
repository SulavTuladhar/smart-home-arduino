import dotenv from "dotenv";
import express from "express";
import "reflect-metadata";
import { AppDataSource } from "./database/data-source";
import { startMqttSubscriber } from "./infrastructure/mqtt/mqtt.subscriber";
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

async function bootstrap() {
  try{
    await AppDataSource.initialize();
    console.log("Database connected");

    startMqttSubscriber(container.infrastructure.mqttClient);

    container.infrastructure.deviceOfflineMonitor.start();

    app.listen(PORT as any, "0.0.0.0", () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
    });

  } catch(error) {
  console.error("Failed to start server:", error);
  process.exit(1);
  }
}

void bootstrap();
