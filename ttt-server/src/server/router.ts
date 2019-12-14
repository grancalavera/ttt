import { Router } from "express";
import { verify } from "jsonwebtoken";
import {
  createAccessToken,
  createRefreshToken,
  REFRESH_TOKEN_COOKIE,
  sendRefreshToken,
} from "../auth";
import { UserEntity } from "../entity/user-entity";

export const router = Router();

router.get("/", (_, res) => res.redirect("/graphql"));

// see https://github.com/auth0/express-jwt
router.post("/refresh_token", async (req, res) => {
  const token = req.cookies[REFRESH_TOKEN_COOKIE];

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
    sendRefreshToken(res, createRefreshToken(user));
    res.json({ accessToken: createAccessToken(user) });
  } catch (e) {
    console.error(e.message || e);
    res.statusCode = 401;
    res.json({});
  }
});
