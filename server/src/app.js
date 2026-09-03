import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { adminRouter } from "./modules/admin/admin.routes.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { catalogRouter } from "./modules/catalog/catalog.routes.js";
import { farmerRouter } from "./modules/farmers/farmer.routes.js";
import { requestRouter } from "./modules/requests/request.routes.js";
import { errorHandler } from "./shared/middleware/errorHandler.js";
import { notFound } from "./shared/middleware/notFound.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.clientOrigin, credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "nkem-aeronautics-server" });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/farmers", farmerRouter);
  app.use("/api/requests", requestRouter);
  app.use("/api/catalog", catalogRouter);
  app.use("/api/admin", adminRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
