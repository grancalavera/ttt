import "dotenv/config";
import "reflect-metadata";
import { createConnection, getConnectionOptions } from "typeorm";
import { mkServer, mkSubscriptionServer } from "server";
import { createServer } from "http";

main();

async function main() {
  const port = process.env.PORT!;
  const origin = process.env.ORIGIN!;

  const options = await getConnectionOptions(process.env.CONNECTION!);
  await createConnection({ ...options, name: "default" });

  const app = await mkServer(origin);
  const server = createServer(app);

  server.listen(port, () => {
    console.log(`express + graphql server running at port ${port}`);
    mkSubscriptionServer(server);
  });
}
