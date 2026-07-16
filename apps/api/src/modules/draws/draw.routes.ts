import { Router } from "express";
import { db } from "../../db/client.js";
import { DrawController } from "./draw.controller.js";
import { DrawRepository } from "./draw.repository.js";
import { DrawService } from "./draw.service.js";

const repository = new DrawRepository(db);
const service = new DrawService(repository);
const controller = new DrawController(service);

export const drawRoutes = Router();

drawRoutes.post("/", controller.create);
drawRoutes.get("/", controller.list);
drawRoutes.get("/:id", controller.getById);
drawRoutes.patch("/:id", controller.update);
drawRoutes.delete("/:id", controller.remove);
