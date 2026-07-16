import type { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../../utils/response.js";
import type { NumberService } from "./numbers.service.js";

export class NumberController {
  constructor(private readonly service: NumberService) {}

  getDetail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.service.getDetail(req.params, req.query);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  };
}
