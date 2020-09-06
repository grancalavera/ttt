module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  modulePaths: ["<rootDir>/src"],
  collectCoverageFrom: [
    "src/command/**/*.ts",
    "src/workflow/**/*.ts",
    "src/system/**/*.ts",
    "src/domain/**/*.ts",
    "src/pipeline.ts",
  ],
};
