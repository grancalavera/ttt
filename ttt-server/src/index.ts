import "dotenv/config";
import "reflect-metadata";
import { createConnection, getConnectionOptions } from "typeorm";
import { mkServer } from "server";

main();

async function main() {
  const port = process.env.PORT!;
  const origin = process.env.ORIGIN!;

  const options = await getConnectionOptions(process.env.CONNECTION!);
  await createConnection({ ...options, name: "default" });

  const server = await mkServer(origin);

  server.listen(port, () => {
    console.log(`express + graphql server running at port ${port}`);
  });
}
