import { Router } from "express";
import { db } from "../../db/client.js";
import { BetRepository } from "../bets/bet.repository.js";
import { DrawRepository } from "../draws/draw.repository.js";
import { StatisticsController } from "./statistics.controller.js";
import { StatisticsService } from "./statistics.service.js";

const drawRepository = new DrawRepository(db);
const betRepository = new BetRepository(db);
const service = new StatisticsService(drawRepository, betRepository);
const controller = new StatisticsController(service);

export const statisticsRoutes = Router();

statisticsRoutes.get("/", controller.get);
