import { ApolloServer, makeExecutableSchema } from "apollo-server-express";
import { findAuthenticatedUser, mkSecureResolver } from "auth";
import cookieParser from "cookie-parser";
import cors from "cors";
import { GamesDataSource } from "data-sources/games";
import { TTTAPIDataSource } from "data-sources/ttt-api";
import { UsersDataSource } from "data-sources/users";
import express from "express";
import { readFileSync } from "fs";
import { execute, subscribe } from "graphql";
import { join } from "path";
import { resolvers } from "resolvers";
import { router } from "server/router";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { Server as HTTP_Server } from "http";
import { Server as HTTPS_Server } from "https";

const typeDefs = readFileSync(join(__dirname, "../graphql/schema.graphql"), "utf8");

const schema = makeExecutableSchema({
  resolverValidationOptions: { requireResolversForResolveType: false },
  typeDefs,
  resolvers,
});

export const mkServer = async (origin: string) => {
  const apiBaseUrl = process.env.TTT_API;

  if (!apiBaseUrl) {
    throw new Error("missing required environment variable TTT_API");
  }

  const expressServer = express();
  expressServer.use(express.json());
  expressServer.use(cors({ origin, credentials: true }));
  expressServer.use(cookieParser());
  expressServer.use(router);

  const apolloServer = new ApolloServer({
    context: async ({ req, res, connection }) => {
      if (connection) {
        return connection.context;
      }
      const user = await findAuthenticatedUser(req.headers["authorization"]);
      return { req, res, secure: mkSecureResolver(user) };
    },
    dataSources: () => ({
      users: new UsersDataSource(),
      games: new GamesDataSource(),
      api: new TTTAPIDataSource(apiBaseUrl),
    }),
    schema,
  });

  apolloServer.applyMiddleware({ app: expressServer, cors: false });
  return expressServer;
};

export const mkSubscriptionServer = (server: HTTP_Server | HTTPS_Server) => {
  new SubscriptionServer(
    {
      execute,
      subscribe,
      schema,
      onConnect: async (connectionParams: any, webSocket: any) => {
        const user = await findAuthenticatedUser(connectionParams.authorization);
        const secure = mkSecureResolver(user);
        return { secure };
      },
      // also
      // onDisconnect
      // onOperation
      // onOperationComplete
    },
    { server }
  );
};
