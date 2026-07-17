import { Router } from "express";
import { db } from "../../db/client.js";
import { logger } from "../../utils/logger.js";
import { suggestionService } from "../suggestions/suggestion.routes.js";
import { DrawController } from "./draw.controller.js";
import { DrawRepository } from "./draw.repository.js";
import { DrawService } from "./draw.service.js";

const repository = new DrawRepository(db);

/**
 * Tras crear/editar un sorteo, regenera en segundo plano la sugerencia del día para ese
 * juego (no se espera el resultado: la respuesta del sorteo no depende de esto). Un error aquí
 * solo se registra en el log; nunca debe propagarse como fallo de la petición de sorteos.
 */
const service = new DrawService(repository, (game) => {
  void suggestionService.regenerateFor(game).catch((error: unknown) => {
    logger.error({ error, game }, "No se pudo regenerar la sugerencia del día tras un cambio de sorteo");
  });
});

const controller = new DrawController(service);

export const drawRoutes = Router();

drawRoutes.post("/", controller.create);
drawRoutes.get("/", controller.list);
drawRoutes.get("/:id", controller.getById);
drawRoutes.patch("/:id", controller.update);
drawRoutes.delete("/:id", controller.remove);
