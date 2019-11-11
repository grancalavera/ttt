import { MiddlewareFn } from "type-graphql";
import { TTTContext } from "./context";
import { User } from "./entity/user";
import { sign, verify } from "jsonwebtoken";
import { Response } from "express";

export const REFRESH_TOKEN_COOKIE = "et3";

export const isAuth: MiddlewareFn<TTTContext> = ({ context }, next) => {
  try {
    const authorization = context.req.headers["authorization"]!;
    const token = authorization.split(" ")[1];
    const payload = decodeToken(token);
    context.payload = payload;
    return next();
  } catch (e) {
    console.error("`isAuth: either:");
    console.error('`isAuth: 1. there is no "authorization" header, or');
    console.error('`isAuth: 2. the "authorization" header invalid, or');
    console.error("`isAuth: 3. the token verification failed, or");
    console.error("`isAuth: 4. the token payload is invalid.");
    console.error(JSON.stringify(context.req.headers, null, 2));
    console.error(e.message);
    console.log(e.stack);
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

const decodeToken = (token: string) => {
  const secret = process.env.ACCESS_TOKEN_SECRET!;
  const payload = verify(token, secret);
  return payload;
};
