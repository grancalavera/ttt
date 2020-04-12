import { HttpLink } from "@apollo/client";

export const httpLinkMiddleware = (endpoint: URL) =>
  new HttpLink({
    uri: endpoint.toString(),
    credentials: "include"
  });
