import type { NextFunction, Request, Response } from "express";
import { sendPaged, sendSuccess } from "../../utils/response.js";
import type { SuggestionService } from "./suggestion.service.js";

export class SuggestionController {
  constructor(private readonly service: SuggestionService) {}

  today = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.getTodayAll();
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { data, meta } = await this.service.list(req.query);
      sendPaged(res, data, meta);
    } catch (error) {
      next(error);
    }
  };
}
