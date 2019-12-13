import { User } from "entity/user";
import { Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";

export const REFRESH_TOKEN_COOKIE = "et3";

export type SecureResolver = <T = void>(
  runEffect: (user: User) => T | Promise<T>
) => T | Promise<T>;

type MakeSecureResolver = (user?: User) => SecureResolver;

export const mkSecureResolver: MakeSecureResolver = user => runEffect => {
  if (user) {
    return runEffect(user);
  } else {
    throw new Error("not authorized");
  }
};

export const findCurrentUser = async (
  req: Request
): Promise<User | undefined> => {
  try {
    const authorization = req.headers["authorization"]!;
    const tokenString = authorization.split(" ")[1];
    const token: any = decodeToken(tokenString);
    const user = await User.findOne({ where: { id: token.userId } });
    return user;
  } catch (e) {
    console.info(`findCurrentUser: failed to find current user`);
    console.info(e.message || e);
  }
};

export const createAccessToken = (user: User) => {
  return sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
  });
};

export const createRefreshToken = (user: User) => {
  return sign(
    { userId: user.id, tokenVersion: user.tokenVersion },
    process.env.ACCESS_TOKEN_EXPIRES_IN || "7d",
    {
      expiresIn: "7d",
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
