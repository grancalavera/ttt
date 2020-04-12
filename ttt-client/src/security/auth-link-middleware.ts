import { ApolloLink } from "@apollo/client";
import { getAccessToken } from "./access-token";

export const authLinkMiddleware = new ApolloLink((operation, forward) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    const ctx = operation.getContext();
    const headers = ctx.headers || {};
    operation.setContext({
      headers: {
        ...headers,
        authorization: `bearer ${accessToken}`
      }
    });
  }

  return forward(operation);
});
