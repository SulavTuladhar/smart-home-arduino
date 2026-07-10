import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./data-source";
import motionRouter from "./routes/motion";
import "./libs/mqtt";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use("/motion", motionRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

async function bootstrap() {
  await AppDataSource.initialize();
  console.log("Database connected");

  app.listen(PORT as any, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
