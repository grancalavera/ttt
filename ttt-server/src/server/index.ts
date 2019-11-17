import { ApolloServer, makeExecutableSchema } from "apollo-server-express";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { readFileSync } from "fs";
import { join } from "path";
import { mkSecureResolver } from "../auth";
import { resolvers } from "../resolvers";
import { router } from "./router";

export const mkServer = async (origin: string) => {
  const typeDefs = readFileSync(
    join(__dirname, "../graphql/schema.graphql"),
    "utf8"
  );

  const schema = makeExecutableSchema({
    resolverValidationOptions: { requireResolversForResolveType: false },
    typeDefs,
    resolvers
  });

  const expressServer = express();
  expressServer.use(express.json());
  expressServer.use(cors({ origin, credentials: true }));
  expressServer.use(cookieParser());
  expressServer.use(router);

  const apolloServer = new ApolloServer({
    context: ({ req, res, connection }) => {
      if (connection) {
        return connection;
      }

      return { req, res, secure: mkSecureResolver(req) };
    },
    dataSources: () => ({}),
    schema
  });

  apolloServer.applyMiddleware({ app: expressServer, cors: false });

  return expressServer;
};
