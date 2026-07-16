import type { Request, Response, NextFunction } from "express";
import { requireParam } from "../../utils/http-error.js";
import { sendSuccess } from "../../utils/response.js";
import * as gameService from "./game.service.js";

export function listGamesHandler(_req: Request, res: Response): void {
  sendSuccess(res, gameService.listGames());
}

export function getGameHandler(req: Request, res: Response, next: NextFunction): void {
  try {
    sendSuccess(res, gameService.getGame(requireParam(req.params.id, "id")));
  } catch (error) {
    next(error);
  }
}
