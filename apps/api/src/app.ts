import cors from "cors";
import express, { type Express } from "express";
import { pinoHttp } from "pino-http";
import { env } from "./config/env.js";
import { errorHandlerMiddleware } from "./middleware/error-handler.js";
import { notFoundMiddleware } from "./middleware/not-found.js";
import { betRoutes } from "./modules/bets/bet.routes.js";
import { comparisonRoutes } from "./modules/comparison/comparison.routes.js";
import { dashboardRoutes } from "./modules/dashboard/dashboard.routes.js";
import { drawRoutes } from "./modules/draws/draw.routes.js";
import { gameRoutes } from "./modules/games/game.routes.js";
import { numberRoutes } from "./modules/numbers/numbers.routes.js";
import { statisticsRoutes } from "./modules/statistics/statistics.routes.js";
import { logger } from "./utils/logger.js";
import { sendSuccess } from "./utils/response.js";

export function createApp(): Express {
  const app = express();

  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json());
  app.use(pinoHttp({ logger, autoLogging: env.httpLogs }));

  app.get("/api/health", (_req, res) => {
    sendSuccess(res, { status: "ok", uptime: process.uptime() });
  });

  app.use("/api/games", gameRoutes);
  app.use("/api/draws", drawRoutes);
  app.use("/api/bets", betRoutes);
  app.use("/api/comparison", comparisonRoutes);
  app.use("/api/statistics", statisticsRoutes);
  app.use("/api/numbers", numberRoutes);
  app.use("/api/dashboard", dashboardRoutes);

  app.use(notFoundMiddleware);
  app.use(errorHandlerMiddleware);

  return app;
}
