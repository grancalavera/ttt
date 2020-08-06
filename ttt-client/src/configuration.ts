export const endpoints = {
  graphqlEndpoint: new URL(process.env["REACT_APP_GRAPHQL_ENDPOINT"] ?? "").toString(),
  anonymousUserEndpoint: new URL(
    process.env["REACT_APP_ANONYMOUS_USER_ENDPOINT"] ?? ""
  ).toString(),
};
