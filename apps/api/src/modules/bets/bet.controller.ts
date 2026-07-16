import type { NextFunction, Request, Response } from "express";
import { requireParam } from "../../utils/http-error.js";
import { sendCreated, sendPaged, sendSuccess } from "../../utils/response.js";
import { listBetsQuerySchema } from "./bet.schemas.js";
import type { BetService } from "./bet.service.js";

export class BetController {
  constructor(private readonly service: BetService) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bet = await this.service.create(req.body);
      sendCreated(res, bet);
    } catch (error) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = listBetsQuerySchema.parse(req.query);
      const { data, meta } = await this.service.list(query);
      sendPaged(res, data, meta);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bet = await this.service.getById(requireParam(req.params.id, "id"));
      sendSuccess(res, bet);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bet = await this.service.update(requireParam(req.params.id, "id"), req.body);
      sendSuccess(res, bet);
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
