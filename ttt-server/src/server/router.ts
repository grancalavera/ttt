import { registerUser } from "data-sources/users";
import { RequestHandler, Response, Router } from "express";
import { verify } from "jsonwebtoken";
import * as auth from "../auth";
import { UserEntity } from "../entity/user-entity";

export const router = Router();
export const ANONYMOUS_USER_ROUTE = "/anonymous-user";

router.get("/", (_, res) => res.redirect("/graphql"));

// see https://github.com/auth0/express-jwt
const refreshJWT: RequestHandler = async (req, res, next) => {
  const token = req.cookies[auth.REFRESH_TOKEN_COOKIE];

  if (!token) {
    next();
    return;
  }

  const payload: any = verify(token, process.env.REFRESH_TOKEN_SECRET!);
  const user = await UserEntity.findOne({ id: payload.userId });

  if (!user) {
    next();
    return;
  }

  if (user.tokenVersion !== payload.tokenVersion) {
    next();
    return;
  }

  const accessToken = auth.createAccessToken(user);
  setRefreshTokenCookie(res, user);
  sendCredentials(res, user, accessToken);
};

const registerAnonymousUser: RequestHandler = async (req, res, next) => {
  try {
    const { user, accessToken } = await registerUser();
    setRefreshTokenCookie(res, user);
    sendCredentials(res, user, accessToken);
  } catch (e) {
    next();
  }
};

const unauthorized: RequestHandler = (req, res) => {
  res.status(401);
  res.send({});
};

router.post(ANONYMOUS_USER_ROUTE, refreshJWT);
router.post(ANONYMOUS_USER_ROUTE, registerAnonymousUser);
router.post(ANONYMOUS_USER_ROUTE, unauthorized);

export const setRefreshTokenCookie = (res: Response, user: UserEntity): void => {
  res.cookie("et3", auth.createRefreshToken(user), {
    httpOnly: true,
    path: ANONYMOUS_USER_ROUTE,
  });
};

const sendCredentials = (res: Response, user: UserEntity, accessToken: string) => {
  res.json({ user, accessToken });
};
