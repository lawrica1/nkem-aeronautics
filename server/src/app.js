import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { adminRouter } from "./modules/admin/admin.routes.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { catalogRouter } from "./modules/catalog/catalog.routes.js";
import { droneRouter } from "./modules/drones/drone.routes.js";
import { farmerRouter } from "./modules/farmers/farmer.routes.js";
import { newsRouter } from "./modules/news/news.routes.js";
import { notificationRouter } from "./modules/notifications/notification.routes.js";
import { operationRouter } from "./modules/operations/operation.routes.js";
import { orderRouter } from "./modules/orders/order.routes.js";
import { organizationRouter } from "./modules/organizations/organization.routes.js";
import { partRequestRouter } from "./modules/partRequests/partRequest.routes.js";
import { partnerRouter } from "./modules/partners/partner.routes.js";
import { paymentRouter } from "./modules/payments/payment.routes.js";
import { pilotRouter } from "./modules/pilots/pilot.routes.js";
import { productRouter } from "./modules/products/product.routes.js";
import { quoteRouter } from "./modules/quotes/quote.routes.js";
import { requestRouter } from "./modules/requests/request.routes.js";
import { storageRouter } from "./modules/storage/storage.routes.js";
import { telemetryRouter } from "./modules/telemetry/telemetry.routes.js";
import { errorHandler } from "./shared/middleware/errorHandler.js";
import { notFound } from "./shared/middleware/notFound.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  // In dev, Next.js picks whatever port is free (3000, 3001, ...), so CLIENT_ORIGIN alone
  // is too brittle. Allow any localhost port in dev; stay locked to the real origin in prod.
  const corsOrigin =
    env.nodeEnv === "production"
      ? env.clientOrigin
      : (origin, callback) => {
          if (!origin || /^http:\/\/localhost:\d+$/.test(origin)) return callback(null, true);
          callback(new Error("Not allowed by CORS"));
        };
  app.use(cors({ origin: corsOrigin, credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "nkem-aeronautics-server" });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/farmers", farmerRouter);
  app.use("/api/requests", requestRouter);
  app.use("/api/catalog", catalogRouter);
  app.use("/api/storage", storageRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/pilots", pilotRouter);
  app.use("/api/drones", droneRouter);
  app.use("/api/operations", operationRouter);
  app.use("/api/products", productRouter);
  app.use("/api/orders", orderRouter);
  app.use("/api/part-requests", partRequestRouter);
  app.use("/api/notifications", notificationRouter);
  app.use("/api/news", newsRouter);
  app.use("/api/organizations", organizationRouter);
  app.use("/api/partners", partnerRouter);
  app.use("/api/payments", paymentRouter);
  app.use("/api/quotes", quoteRouter);
  app.use("/api/telemetry", telemetryRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
