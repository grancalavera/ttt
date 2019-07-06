import { ApolloServer, gql } from "apollo-server";
import { dataSources } from "./data-sources";
import { resolvers } from "./resolvers";
import { store } from "./store";

const typeDefs = gql`
  type Query {
    me: User
  }

  type Mutation {
    login(alias: String!, email: String!): String
  }

  type User {
    id: ID!
    email: String!
    alias: String!
  }
`;

const server = new ApolloServer({ typeDefs, dataSources, resolvers });

store
  .sync()
  .then(() => server.listen())
  .then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
