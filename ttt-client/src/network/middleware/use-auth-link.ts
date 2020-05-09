import { ApolloLink } from "@apollo/client";
import { useApplication } from "application";

export const useAuthLink = () => {
  const { accessToken } = useApplication();
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
          authorization: `bearer ${accessToken}`,
        },
      });
    }

    return forward(operation);
  });
