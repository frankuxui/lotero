import type { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../../utils/response.js";
import type { ComparisonService } from "./comparison.service.js";

export class ComparisonController {
  constructor(private readonly service: ComparisonService) {}

  compare = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.service.compare(req.body);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  };
}
