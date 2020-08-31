module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  modulePaths: ["<rootDir>/src"],
  collectCoverage: true,
  collectCoverageFrom: ["src/command/**/*.ts", "src/workflow/**/*.ts"],
};
