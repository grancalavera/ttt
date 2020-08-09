import "dotenv/config";
import { createServer } from "http";
import "reflect-metadata";
import { mkServer, mkSubscriptionServer } from "server";
import { createConnection, getConnectionOptions } from "typeorm";

(async () => {
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
})();
