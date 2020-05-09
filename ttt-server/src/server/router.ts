import { createUser } from "data-sources/users";
import { response, Router, Response } from "express";
import { verify } from "jsonwebtoken";
import * as auth from "../auth";
import { UserEntity } from "../entity/user-entity";
import { User } from "generated/graphql";

export const router = Router();

router.get("/", (_, res) => res.redirect("/graphql"));

// see https://github.com/auth0/express-jwt
// this path is duplicated in ttt-server/src/auth.ts
router.post("/refresh-token", async (req, res) => {
  const token = req.cookies[auth.REFRESH_TOKEN_COOKIE];

  try {
    if (!token) {
      throw new Error("missing refresh token");
    }

    const payload: any = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    const user = await UserEntity.findOne({ id: payload.userId });

    if (!user) {
      throw new Error(`user ${payload.userId} does not exist`);
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      throw new Error("token version mismatch");
    }

    console.log("sending refreshed tokens...");
    sendRefreshToken(res, user);
    res.json({ accessToken: auth.createAccessToken(user) });
  } catch (e) {
    console.error(e.message || e);
    res.statusCode = 401;
    res.end();
  }
});

router.post("/anonymous-user", async (req, res) => {
  const user = await createUser();
  sendRefreshToken(res, user);
  response.json(user);
});

const sendRefreshToken = (res: Response, user: UserEntity): void => {
  const refreshToken = auth.createAccessToken(user);
  auth.sendRefreshToken(res, refreshToken);
};
