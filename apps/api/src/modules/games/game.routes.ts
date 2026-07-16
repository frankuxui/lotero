import { Router } from "express";
import { getGameHandler, listGamesHandler } from "./game.controller.js";

export const gameRoutes = Router();

gameRoutes.get("/", listGamesHandler);
gameRoutes.get("/:id", getGameHandler);
