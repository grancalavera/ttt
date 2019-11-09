import { Request, Response } from "express";
import { verify } from "jsonwebtoken";

export interface TTTContext {
  req: Request;
  res: Response;
  payload?: AccessTokenPayload;
}

export interface AccessTokenPayload {
  userId: string;
}

const isValidPayload = (value: any): value is AccessTokenPayload =>
  typeof value.userId === "string";

export const decodeToken = (token: string): AccessTokenPayload => {
  const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
  if (isValidPayload(payload)) {
    return payload;
  } else {
    throw new Error("invalid JWT payload");
  }
};
