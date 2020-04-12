import { ApolloLink } from "@apollo/client";

export const noop = new ApolloLink((o, f) => f(o));
