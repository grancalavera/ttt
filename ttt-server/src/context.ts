import { Request, Response } from "express";

export interface TTTContext {
  req: Request;
  res: Response;
  payload?: any;
}
