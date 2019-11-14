import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import { verify } from "jsonwebtoken";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import {
  createAccessToken,
  createRefreshToken,
  REFRESH_TOKEN_COOKIE,
  sendRefreshToken
} from "./auth";
import { User } from "./entity/user";
import { registerUser, UserResolver } from "./resolvers/user";
import { UtilsResolver } from "./resolvers/utils";

const port = process.env.PORT || 4000;

(async () => {
  // pass a flag from env vars to sync on startup (conditionally)
  await createConnection({
    type: "sqlite",
    database: "ttt.sqlite",
    entities: ["src/entity/**/*.ts"],
    synchronize: true,
    cli: {
      entitiesDir: "src/entity"
    }
  });

  const app = express();
  app.use(express.json());
  app.use(cors({ origin: "http://localhost:3000", credentials: true }));
  app.use(cookieParser());

  app.get("/", (_, res) => res.redirect("/graphql"));

  app.post("/refresh_token", async (req, res) => {
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

  const apolloServer = new ApolloServer({
    schema: await buildSchema({ resolvers: [UserResolver, UtilsResolver] }),
    context: ({ req, res }) => ({ req, res, createConnection })
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(port, () => {
    console.log(`express + graphql server running at port ${port}`);
  });
})();
