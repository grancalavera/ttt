import { HttpLink } from "@apollo/client";
import { useConfiguration } from "../../configuration/configuration-context";

export const useHttpLink = () => {
  const { graphqlEndpoint } = useConfiguration();
  return httpLink(graphqlEndpoint);
};

const httpLink = (endpoint: URL) =>
  new HttpLink({
    uri: endpoint.toString(),
    credentials: "include"
  });
