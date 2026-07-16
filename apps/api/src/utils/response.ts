import type { Response } from "express";

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiFailure {
  success: false;
  error: {
    message: string;
    details?: unknown;
  };
}

export interface PageMeta {
  total: number;
  limit: number;
  offset: number;
}

export interface ApiSuccessPaged<T> {
  success: true;
  data: T[];
  meta: PageMeta;
}

export function sendSuccess<T>(res: Response, data: T, status = 200): void {
  const body: ApiSuccess<T> = { success: true, data };
  res.status(status).json(body);
}

export function sendCreated<T>(res: Response, data: T): void {
  sendSuccess(res, data, 201);
}

export function sendPaged<T>(res: Response, data: T[], meta: PageMeta, status = 200): void {
  const body: ApiSuccessPaged<T> = { success: true, data, meta };
  res.status(status).json(body);
}
