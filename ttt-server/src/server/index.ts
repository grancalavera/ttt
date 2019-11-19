import { ApolloServer, makeExecutableSchema } from "apollo-server-express";
import { mkSecureResolver } from "auth";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { readFileSync } from "fs";
import { join } from "path";
import { resolvers } from "resolvers";
import { router } from "server/router";
import { UsersDataSource } from "data-sources/users";
import { GamesDataSource } from "data-sources/games";

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
    dataSources: () => ({
      users: new UsersDataSource(),
      games: new GamesDataSource()
    }),
    schema
  });

  apolloServer.applyMiddleware({ app: expressServer, cors: false });

  return expressServer;
};
