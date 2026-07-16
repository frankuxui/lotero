import type { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../../utils/response.js";
import type { DashboardService } from "./dashboard.service.js";

export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  get = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.service.getDashboard();
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  };
}
