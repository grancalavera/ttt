import { ApolloClient, from as apolloLinkFrom, InMemoryCache } from "@apollo/client";
import { authLinkMiddleware } from "../security/auth-link-middleware";
import { refreshJWTMiddleware } from "../security/refresh-jwt-middleware";
import { httpLinkMiddleware } from "./http-link";

export const client = new ApolloClient({
  link: apolloLinkFrom([
    refreshJWTMiddleware(new URL("http://localhost:4000/refresh_token")),
    authLinkMiddleware,
    httpLinkMiddleware(new URL("http://localhost:4000/graphql"))
  ]),
  cache: new InMemoryCache()
});
