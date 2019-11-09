import { MiddlewareFn } from "type-graphql";
import { TTTContext, decodeToken } from "./context";
import { User } from "./entity/user";
import { sign } from "jsonwebtoken";
import { Response } from "express";

export const REFRESH_TOKEN_COOKIE = "et3";

export const isAuth: MiddlewareFn<TTTContext> = ({ context }, next) => {
  try {
    const authorization = context.req.headers["authorization"]!;
    const token = authorization.split(" ")[1];
    context.payload = decodeToken(token);
    return next();
  } catch (e) {
    console.error("`isAuth: either:");
    console.error('`isAuth: 1. there is no "authorization" header, or');
    console.error('`isAuth: 2. the "authorization" header invalid, or');
    console.error("`isAuth: 3. the token verification failed, or");
    console.error("`isAuth: 4. the token payload is invalid.");
    console.error(JSON.stringify(context.req.headers, null, 2));
    console.error(e);
    throw new Error("not authorized");
  }
};

export const createAccessToken = (user: User) => {
  return sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "15m"
  });
};

export const createRefreshToken = (user: User) => {
  return sign(
    { userId: user.id, tokenVersion: user.tokenVersion },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: "7d"
    }
  );
};

export const sendRefreshToken = (res: Response, token: string): void => {
  res.cookie("et3", token, { httpOnly: true, path: "/refresh_token" });
};
