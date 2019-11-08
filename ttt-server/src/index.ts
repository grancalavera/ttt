import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/user";
import cors from "cors";
import cookieParser from "cookie-parser";

const port = 4000;

(async () => {
  const app = express();
  app.use(cors({ origin: "http://localhost:3000", credentials: true }));
  app.use(cookieParser());
  app.get("/", (_, res) => {
    res.send(`
<a href="/graphql">click here to install all the viruses</a>
    `);
  });

  const apolloServer = new ApolloServer({
    schema: await buildSchema({ resolvers: [UserResolver] }),
    context: ({ req, res }) => ({ req, res })
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(port, () => {
    console.log(`express + graphql server running at port ${port}`);
  });
})();

// import { ApolloServer, makeExecutableSchema } from "apollo-server";
// import { dataSources, context } from "./environment";
// import { resolvers } from "./resolvers";
// import * as store from "./store";
// import { importSchema } from "graphql-import";
// import { join } from "path";

// const typeDefs = importSchema(join(__dirname, "schema.graphql"));

// const schema = makeExecutableSchema({
//   // this should be fine because we're adding __typename to all members of union types
//   // also, I didn't found a way to implement a __resolveType function that would work
//   // when the parent is a Promise
//   resolverValidationOptions: { requireResolversForResolveType: false },
//   typeDefs,
//   resolvers
// });

// const server = new ApolloServer({
//   schema,//     console.log(`🚀  Server ready at ${url}`);
//     console.log(`🚀  Subscriptions ready at ${subscriptionsUrl}`);

//   dataSources,
//   context
// });

// store
//   .create({ storage: "./store.sqlite" })
//   .sync({ force: true })
//   .then(() => server.listen())
//   .then(({ url, subscriptionsUrl }) => {
//     console.log(`🚀  Server ready at ${url}`);
//     console.log(`🚀  Subscriptions ready at ${subscriptionsUrl}`);
//   });
