import { Router } from "express";
import { db } from "../../db/client.js";
import { BetRepository } from "../bets/bet.repository.js";
import { DrawRepository } from "../draws/draw.repository.js";
import { NumberController } from "./numbers.controller.js";
import { NumberService } from "./numbers.service.js";

const drawRepository = new DrawRepository(db);
const betRepository = new BetRepository(db);
const service = new NumberService(drawRepository, betRepository);
const controller = new NumberController(service);

export const numberRoutes = Router();

numberRoutes.get("/:number", controller.getDetail);
