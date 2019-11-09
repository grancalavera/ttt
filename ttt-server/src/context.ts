import { Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { createConnection as internal_createConnection, Connection } from "typeorm";

export interface TTTContext {
  req: Request;
  res: Response;
  payload?: AccessTokenPayload;
  createConnection: (synchronize?: boolean) => Promise<Connection>;
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

export const createConnection = async (synchronize: boolean = false) => {
  return internal_createConnection({
    type: "sqlite",
    database: "et3.sqlite",
    entities: ["src/entity/**/*.ts"],
    synchronize,
    cli: {
      entitiesDir: "src/entity"
    }
  });
};
