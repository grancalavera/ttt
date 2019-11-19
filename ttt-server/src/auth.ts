import { User } from "entity/user";
import { Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";

export const REFRESH_TOKEN_COOKIE = "et3";

export type SecureResolver = <T = void>(
  runEffect: (user: User) => T
) => Promise<T>;
type MakeSecureResolver = (req: Request) => SecureResolver;

export const mkSecureResolver: MakeSecureResolver = req => async runEffect => {
  try {
    const authorization = req.headers["authorization"]!;
    const tokenString = authorization.split(" ")[1];
    const token: any = decodeToken(tokenString);
    const user = await User.findOne({ where: { id: token.userId } });
    if (user) {
      return runEffect(user);
    } else {
      throw new Error(`user ${token.id} does not exist`);
    }
  } catch (e) {
    console.error("`isAuth: either:");
    console.error('`isAuth: 1. there is no "authorization" header, or');
    console.error('`isAuth: 2. the "authorization" header invalid, or');
    console.error("`isAuth: 3. the token verification failed, or");
    console.error("`isAuth: 4. the token payload is invalid.");
    console.error(JSON.stringify(req.headers, null, 2));
    console.error(e.message);
    console.error(e.stack);
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
