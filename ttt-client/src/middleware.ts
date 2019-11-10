import { ApolloLink, HttpLink, Observable, FetchResult } from "@apollo/client";
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

export const httpLinkMiddleware = new HttpLink({
  uri: "http://localhost:4000/graphql",
  // https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials
  credentials: "include"
});

export const noopMiddleware = new ApolloLink((o, f) => f(o));
