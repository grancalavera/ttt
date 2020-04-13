import { ApolloLink, Observable, FetchResult } from "@apollo/client";
import { decode } from "jsonwebtoken";
import { useConfiguration } from "../../configuration/configuration-context";
import { useSecurity, AccessTokenRef } from "../../security/security-context";

export const useRefreshJWT = () => {
  const { refreshJWTEndpoint } = useConfiguration();
  const { accessTokenRef } = useSecurity();
  return refreshJWT(refreshJWTEndpoint, accessTokenRef);
};

const refreshJWT = (endpoint: URL, accessTokenRef: AccessTokenRef) =>
  new ApolloLink((operation, forward) => {
    // we may not have a token yet, but we want to allow public areas
    // the application to be accessible
    const payload: any = decode(accessTokenRef.current);
    if (!payload || !payload.exp) return forward(operation);

    const isExpired = 1000 * payload.exp < Date.now();

    if (isExpired) {
      return new Observable<FetchResult>(observer => {
        fetch(endpoint.toString(), {
          method: "POST",
          credentials: "include"
        }).then(async response => {
          const { accessToken } = await response.json();
          accessTokenRef.current = accessToken;
          forward(operation).subscribe({
            next: observer.next.bind(observer),
            complete: observer.complete.bind(observer),
            error: observer.error.bind(observer)
          });
        });
      });
    } else {
      return forward(operation);
    }
  });
