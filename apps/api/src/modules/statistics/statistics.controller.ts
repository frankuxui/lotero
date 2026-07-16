import type { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../../utils/response.js";
import type { StatisticsService } from "./statistics.service.js";

export class StatisticsController {
  constructor(private readonly service: StatisticsService) {}

  get = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.service.getStatistics(req.query);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  };
}
