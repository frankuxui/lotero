import { Router } from "express";
import { db } from "../../db/client.js";
import { DrawRepository } from "../draws/draw.repository.js";
import { StatisticsController } from "./statistics.controller.js";
import { StatisticsService } from "./statistics.service.js";

const drawRepository = new DrawRepository(db);
const service = new StatisticsService(drawRepository);
const controller = new StatisticsController(service);

export const statisticsRoutes = Router();

statisticsRoutes.get("/", controller.get);
