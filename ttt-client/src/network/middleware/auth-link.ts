import { ApolloLink } from "@apollo/client";
import { ReadAccessToken, useAccessToken } from "../../security/security-context";

export const useAuthLink = () => {
  const { readAccessToken } = useAccessToken();
  return authLink(readAccessToken);
};

const authLink = (readAccessToken: ReadAccessToken) =>
  new ApolloLink((operation, forward) => {
    const accessToken = readAccessToken();
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
