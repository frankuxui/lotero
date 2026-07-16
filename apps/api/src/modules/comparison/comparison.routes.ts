import { Router } from "express";
import { db } from "../../db/client.js";
import { BetRepository } from "../bets/bet.repository.js";
import { DrawRepository } from "../draws/draw.repository.js";
import { ComparisonController } from "./comparison.controller.js";
import { ComparisonService } from "./comparison.service.js";

const drawRepository = new DrawRepository(db);
const betRepository = new BetRepository(db);
const service = new ComparisonService(drawRepository, betRepository);
const controller = new ComparisonController(service);

export const comparisonRoutes = Router();

comparisonRoutes.post("/", controller.compare);
