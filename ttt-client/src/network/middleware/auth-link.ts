import { ApolloLink } from "@apollo/client";
import { AccessTokenRef, useSecurity } from "../../security/security-context";

export const useAuthLink = () => {
  const { accessTokenRef } = useSecurity();
  return authLink(accessTokenRef);
};

const authLink = (accessTokenRef: AccessTokenRef) =>
  new ApolloLink((operation, forward) => {
    const accessToken = accessTokenRef.current;
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
