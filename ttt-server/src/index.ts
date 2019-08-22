import { ApolloServer, makeExecutableSchema } from "apollo-server";
import { dataSources, context } from "./environment";
import { resolvers } from "./resolvers";
import * as store from "./store";
import { importSchema } from "graphql-import";
import { join } from "path";

const typeDefs = importSchema(join(__dirname, "schema.graphql"));

const schema = makeExecutableSchema({
  typeDefs,
  // this should be fine because we're adding __typename to all members of union types
  // also, I didn't found a way to implement a __resolveType function that would work
  // when the parent is a Promise
  resolverValidationOptions: { requireResolversForResolveType: false }
});

const server = new ApolloServer({
  schema,
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
    console.log(`🚀  Subscriptions ready at ${subscriptionsUrl}`);
  });
