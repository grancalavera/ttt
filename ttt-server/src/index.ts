import { ApolloServer } from "apollo-server";
import { dataSources } from "./data-sources";
import { resolvers } from "./resolvers";
import { store } from "./store";
import { typeDefs } from "@grancalavera/ttt-schema";

const server = new ApolloServer({ typeDefs, dataSources, resolvers });

store
  .sync()
  .then(() => server.listen())
  .then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
