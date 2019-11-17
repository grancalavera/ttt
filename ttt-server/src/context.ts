import { Request, Response } from "express";
import { SecureResolver } from "./auth";

export interface TTTContext {
  req: Request;
  res: Response;
  secure: SecureResolver;
}
