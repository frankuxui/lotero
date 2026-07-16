import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { GameNotFoundError } from "../config/game-config.js";
import { HttpError } from "../utils/http-error.js";
import { logger } from "../utils/logger.js";

export function errorHandlerMiddleware(error: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: { message: "Error de validación", details: error.issues },
    });
    return;
  }

  if (error instanceof GameNotFoundError) {
    res.status(404).json({
      success: false,
      error: { message: error.message },
    });
    return;
  }

  if (error instanceof HttpError) {
    res.status(error.status).json({
      success: false,
      error: { message: error.message, details: error.details },
    });
    return;
  }

  logger.error({ err: error }, "Error no controlado");
  res.status(500).json({
    success: false,
    error: { message: "Error interno del servidor" },
  });
}
