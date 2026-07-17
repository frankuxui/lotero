import { Router } from "express";
import { db } from "../../db/client.js";
import { DrawRepository } from "../draws/draw.repository.js";
import { SuggestionController } from "./suggestion.controller.js";
import { SuggestionRepository } from "./suggestion.repository.js";
import { SuggestionService } from "./suggestion.service.js";

const drawRepository = new DrawRepository(db);
const suggestionRepository = new SuggestionRepository(db);
const service = new SuggestionService(suggestionRepository, drawRepository);
const controller = new SuggestionController(service);

export const suggestionRoutes = Router();

suggestionRoutes.get("/today", controller.today);
suggestionRoutes.get("/", controller.list);

/** Reutilizado por draw.routes.ts para regenerar la sugerencia tras crear/editar un sorteo, sin duplicar la instanciación del servicio. */
export const suggestionService = service;
