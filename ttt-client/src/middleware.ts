import { ApolloLink, FetchResult, HttpLink, Observable } from "@apollo/client";
import { getAccessToken, setAccessToken } from "./access-token";
import { decode } from "jsonwebtoken";

export const noopMiddleware = new ApolloLink((o, f) => f(o));

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

export const pauseMiddleware = new ApolloLink(
  (operation, forward) =>
    new Observable<FetchResult>(observer => {
      setTimeout(() => {
        forward(operation).subscribe({
          next: v => observer.next(v),
          complete: () => observer.complete(),
          error: e => observer.error(e)
        });
      }, 1000);
    })
);

export const refreshJWTMiddleware = new ApolloLink((operation, forward) => {
  // we may not have a token yet, but we want to allow public areas
  // the application to be accessible
  const payload: any = decode(getAccessToken());
  if (!payload || !payload.exp) return forward(operation);

  const isExpired = 1000 * payload.exp < Date.now();

  if (isExpired) {
    return new Observable<FetchResult>(observer => {
      fetch("http://localhost:4000/refresh_token", {
        method: "POST",
        credentials: "include"
      }).then(async response => {
        const { accessToken } = await response.json();
        setAccessToken(accessToken);
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

export const httpLinkMiddleware = new HttpLink({
  uri: "http://localhost:4000/graphql",
  // https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials
  credentials: "include"
});
