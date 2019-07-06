import { ApolloServer } from "apollo-server";
import { dataSources } from "./data-sources";
import { resolvers } from "./resolvers";
import { store } from "./store";
import { importSchema } from "graphql-import";
import { join } from "path";

const schema = join(__dirname, "./schema.graphql");
const typeDefs = importSchema(schema);

const server = new ApolloServer({ typeDefs, dataSources, resolvers });

store
  .sync()
  .then(() => server.listen())
  .then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
