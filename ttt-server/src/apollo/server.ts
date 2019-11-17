import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "../resolvers/user";
import { UtilsResolver } from "../resolvers/utils";
import { GameResolver } from "../resolvers/game";

export const mkServer = async () =>
  new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, UtilsResolver, GameResolver]
    }),
    context: ({ req, res }) => ({ req, res })
  });
