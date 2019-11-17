import "dotenv/config";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { mkServer } from "./server";
import { User } from "./entity/user";

main();

async function main() {
  const port = process.env.PORT!;
  const origin = process.env.ORIGIN!;

  const connection = await createConnection(process.env.CONNECTION!);
  User.useConnection(connection);

  const server = await mkServer(origin);

  server.listen(port, () => {
    console.log(`express + graphql server running at port ${port}`);
  });
}
