import { ApolloServer, gql } from "apollo-server";

type User = {
  id: String;
  name: string;
};

const users: User[] = [];

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    users: [User]
  }
`;

const resolvers = {
  Query: {
    users: () => users
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
