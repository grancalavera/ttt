import "dotenv/config";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { mkServer } from "./apollo/server";
import { User } from "./entity/user";
import { mkApp } from "./express/app";

const port = process.env.PORT!;

(async () => {
  const connection = await createConnection(process.env.CONNECTION!);
  User.useConnection(connection);

  const app = mkApp();
  const server = await mkServer();

  server.applyMiddleware({ app, cors: false });

  app.listen(port, () => {
    console.log(`express + graphql server running at port ${port}`);
  });
})();
