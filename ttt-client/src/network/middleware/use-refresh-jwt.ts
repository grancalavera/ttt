import { ApolloLink, FetchResult, Observable } from "@apollo/client";
import { useApplication } from "application";
import { useConfiguration } from "configuration";
import { decode } from "jsonwebtoken";

export const useRefreshJWT = () => {
  const { refreshJWTEndpoint } = useConfiguration();
  const { accessToken, login } = useApplication();
  return refreshJWT(refreshJWTEndpoint, accessToken, login);
};

const refreshJWT = (
  endpoint: URL,
  accessToken: string,
  login: (accessToken: string) => void
) =>
  new ApolloLink((operation, forward) => {
    // we may not have a token yet, but we want to allow public areas
    // the application to be accessible
    const payload: any = decode(accessToken);
    if (!payload || !payload.exp) return forward(operation);

    const isExpired = 1000 * payload.exp < Date.now();

    if (isExpired) {
      return new Observable<FetchResult>((observer) => {
        fetch(endpoint.toString(), {
          method: "POST",
          credentials: "include",
        }).then(async (response) => {
          const { accessToken } = await response.json();
          login(accessToken);
          forward(operation).subscribe({
            next: observer.next.bind(observer),
            complete: observer.complete.bind(observer),
            error: observer.error.bind(observer),
          });
        });
      });
    } else {
      return forward(operation);
    }
  });
