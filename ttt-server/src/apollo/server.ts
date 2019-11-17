import { ApolloServer, makeExecutableSchema } from "apollo-server-express";
import { readFileSync } from "fs";
import { join } from "path";
import { secure } from "../auth";
import { resolvers } from "../resolvers";

const typeDefs = readFileSync(
  join(__dirname, "../graphql/schema.graphql"),
  "utf8"
);

const schema = makeExecutableSchema({
  resolverValidationOptions: { requireResolversForResolveType: false },
  typeDefs,
  resolvers
});

export const mkServer = async () =>
  new ApolloServer({
    context: ({ req, res, connection }) => {
      if (connection) {
        return connection;
      }

      return { req, res, secure: secure(req) };
    },
    dataSources: () => ({}),
    schema
  });
