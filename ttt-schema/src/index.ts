import { importSchema } from "graphql-import";
import { join } from "path";
export const typeDefs = importSchema(join(__dirname, "schema.graphql"));

import * as server from "./generated/server";
export { server };
