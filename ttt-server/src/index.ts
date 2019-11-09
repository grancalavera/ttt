import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { REFRESH_TOKEN_COOKIE } from "./common";
import { UserResolver } from "./resolvers/user";

const port = 4000;

(async () => {
  await createConnection({
    type: "sqlite",
    database: "et3.sqlite",
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

  // move the routes somewhere else
  app.get("/", (_, res) => {
    res.send(`
<a href="/graphql">click here to install all the viruses</a>
    `);
  });

  app.post("/refresh_token", async (req, res) => {
    const token = req.cookies[REFRESH_TOKEN_COOKIE];

    if (!token) {
      res.statusCode = 401;
      return res.send({});
    }
  });

  const apolloServer = new ApolloServer({
    schema: await buildSchema({ resolvers: [UserResolver] }),
    context: ({ req, res }) => ({ req, res })
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(port, () => {
    console.log(`express + graphql server running at port ${port}`);
  });
})();
