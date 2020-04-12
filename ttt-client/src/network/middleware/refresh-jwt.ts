import { ApolloLink, Observable, FetchResult } from "@apollo/client";
import { decode } from "jsonwebtoken";
import { useConfiguration } from "../../configuration/configuration-context";
import {
  useAccessToken,
  ReadAccessToken,
  WriteAccessToken
} from "../../security/security-context";

const refreshJWT = (
  endpoint: URL,
  readAccessToken: ReadAccessToken,
  writeAccessToken: WriteAccessToken
) =>
  new ApolloLink((operation, forward) => {
    // we may not have a token yet, but we want to allow public areas
    // the application to be accessible
    const payload: any = decode(readAccessToken() ?? "");
    if (!payload || !payload.exp) return forward(operation);

    const isExpired = 1000 * payload.exp < Date.now();

    if (isExpired) {
      return new Observable<FetchResult>(observer => {
        fetch(endpoint.toString(), {
          method: "POST",
          credentials: "include"
        }).then(async response => {
          const { accessToken } = await response.json();
          writeAccessToken(accessToken);
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

export const useRefreshJWT = () => {
  const { refreshJWTEndpoint } = useConfiguration();
  const { readAccessToken, writeAccessToken } = useAccessToken();
  return refreshJWT(refreshJWTEndpoint, readAccessToken, writeAccessToken);
};
