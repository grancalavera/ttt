import { ApolloLink } from "@apollo/client";

export const noopLink = new ApolloLink((o, f) => f(o));
