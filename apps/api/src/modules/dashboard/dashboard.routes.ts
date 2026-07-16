import { Router } from "express";
import { db } from "../../db/client.js";
import { BetRepository } from "../bets/bet.repository.js";
import { ComparisonService } from "../comparison/comparison.service.js";
import { DrawRepository } from "../draws/draw.repository.js";
import { DashboardController } from "./dashboard.controller.js";
import { DashboardService } from "./dashboard.service.js";

const drawRepository = new DrawRepository(db);
const betRepository = new BetRepository(db);
const comparisonService = new ComparisonService(drawRepository, betRepository);
const service = new DashboardService(drawRepository, betRepository, comparisonService);
const controller = new DashboardController(service);

export const dashboardRoutes = Router();

dashboardRoutes.get("/", controller.get);
