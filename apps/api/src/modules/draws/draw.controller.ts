import type { NextFunction, Request, Response } from "express";
import { requireParam } from "../../utils/http-error.js";
import { sendCreated, sendPaged, sendSuccess } from "../../utils/response.js";
import { listDrawsQuerySchema } from "./draw.schemas.js";
import type { DrawService } from "./draw.service.js";

export class DrawController {
  constructor(private readonly service: DrawService) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const draw = await this.service.create(req.body);
      sendCreated(res, draw);
    } catch (error) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = listDrawsQuerySchema.parse(req.query);
      const { data, meta } = await this.service.list(query);
      sendPaged(res, data, meta);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const draw = await this.service.getById(requireParam(req.params.id, "id"));
      sendSuccess(res, draw);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const draw = await this.service.update(requireParam(req.params.id, "id"), req.body);
      sendSuccess(res, draw);
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.service.remove(requireParam(req.params.id, "id"));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
