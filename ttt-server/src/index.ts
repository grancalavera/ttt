import { ApolloServer } from "apollo-server";
import { dataSources, context } from "./environment";
import { resolvers } from "./resolvers";
import * as store from "./store";
import { importSchema } from "graphql-import";
import { join } from "path";

const typeDefs = importSchema(join(__dirname, "schema.graphql"));

const server = new ApolloServer({
  typeDefs,
  dataSources,
  resolvers,
  context
});

store
  .create({ storage: "./store.sqlite" })
  .sync()
  .then(() => server.listen())
  .then(({ url, subscriptionsUrl }) => {
    console.log(`🚀  Server ready at ${url}`);
    console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
  });
