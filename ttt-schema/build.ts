import { join } from "path";
import { mkdirSync, existsSync, readFileSync, writeFileSync } from "fs";

const generatedPath = join(__dirname, "src/generated");
const command = process.argv[2];

switch (command) {
  case "typedefs":
    generateTypeDefs();
    break;
  default:
    console.error(`unknown command ${command}`);
    process.exit(1);
}

function generateTypeDefs() {
  const schemaPath = join(__dirname, "src/schema.graphql");
  const typeDefsPath = join(generatedPath, "typeDefs.ts");

  ensureGeneratedDir();

  console.log(`reading schema from file ${schemaPath}`);
  const schema = readFileSync(schemaPath, "utf8");

  console.log(`writing type definitions to ${typeDefsPath}`);
  writeFileSync(typeDefsPath, typeDefsTemplate(schema), "utf8");
}

function ensureGeneratedDir() {
  if (existsSync(generatedPath)) {
    console.log(`using existing directory ${generatedPath}`);
  } else {
    console.log(`creating directory ${generatedPath}`);
    mkdirSync(generatedPath);
  }
}

function typeDefsTemplate(schema: string): String {
  return `
import gql from "graphql-tag";

export const typeDefs = gql\`
${schema}
\`
`;
}
