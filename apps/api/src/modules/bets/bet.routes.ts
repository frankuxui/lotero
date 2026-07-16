import { Router } from "express";
import { db } from "../../db/client.js";
import { BetController } from "./bet.controller.js";
import { BetRepository } from "./bet.repository.js";
import { BetService } from "./bet.service.js";

const repository = new BetRepository(db);
const service = new BetService(repository);
const controller = new BetController(service);

export const betRoutes = Router();

betRoutes.post("/", controller.create);
betRoutes.get("/", controller.list);
betRoutes.get("/:id", controller.getById);
betRoutes.patch("/:id", controller.update);
betRoutes.delete("/:id", controller.remove);
