import { ApolloLink, FetchResult, Observable } from "@apollo/client";

export const noopMiddleware = new ApolloLink((o, f) => f(o));
