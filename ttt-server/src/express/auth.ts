import { Router } from "express";
import { verify } from "jsonwebtoken";
import {
  createAccessToken,
  createRefreshToken,
  REFRESH_TOKEN_COOKIE,
  sendRefreshToken
} from "../auth";
import { User } from "../entity/user";
import { registerUser } from "../resolvers/user";

export const auth = Router();

// see https://github.com/auth0/express-jwt
auth.post("/refresh_token", async (req, res) => {
  const token = req.cookies[REFRESH_TOKEN_COOKIE];

  try {
    if (!token) {
      throw new Error("missing refresh token");
    }

    const payload: any = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    const user = await User.findOne({ id: payload.userId });

    if (!user) {
      throw new Error(`user ${payload.userId} does not exist`);
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      throw new Error("token version mismatch");
    }

    console.log("sending refreshed tokens...");
    sendRefreshToken(res, createRefreshToken(user));
    res.send({ accessToken: createAccessToken(user) });
  } catch (e) {
    console.error(e.message || e);
    const { accessToken, user } = await registerUser(res);
    console.error("failed to refresh token, registering new user");
    console.log(accessToken);
    console.log(JSON.stringify(user));
    return res.send({ accessToken });
  }
});
