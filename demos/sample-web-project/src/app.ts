import express from "express";
import { formatDate, generateId } from "./utils/helpers";

export function createApp() {
  const app = express();

  app.use(express.json());

  app.get("/", (_req, res) => {
    res.json({
      message: "Welcome to the sample web project",
      timestamp: formatDate(new Date()),
    });
  });

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", id: generateId() });
  });

  app.post("/echo", (req, res) => {
    res.json({
      echoed: req.body,
      receivedAt: formatDate(new Date()),
    });
  });

  return app;
}
