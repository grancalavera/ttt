import { ApolloLink } from "@apollo/client";
import { useSecurity } from "../../security/security-context";

export const useAuthLink = () => {
  const { accessToken } = useSecurity();
  return authLink(accessToken);
};

const authLink = (accessToken: string) =>
  new ApolloLink((operation, forward) => {
    if (accessToken !== "") {
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
