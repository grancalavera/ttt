import React, { useContext } from "react";
import { failProxy } from "../common/fail-proxy";
import { Either, left, lefts, right, rights } from "./either";

const configurationMap = {
  anonymousUserEndpoint: "REACT_APP_ANONYMOUS_USER_ENDPOINT",
  graphqlEndpoint: "REACT_APP_GRAPHQL_ENDPOINT",
};

type ConfigurationKey = keyof typeof configurationMap;

type Configuration = Record<ConfigurationKey, URL>;

const ConfigurationContext = React.createContext<Configuration>(
  failProxy("Configuration")
);

export const ConfigurationProvider: React.FC = ({ children }) => {
  return (
    <ConfigurationContext.Provider value={parseConfiguration()}>
      {children}
    </ConfigurationContext.Provider>
  );
};

const parseConfiguration = (): Configuration => {
  const entries = Object.entries(configurationMap) as [ConfigurationKey, string][];
  const parsed = entries.map(parseConfigurationEntry);
  const errors = lefts(parsed);

  if (errors.length > 0) {
    const message = errors.map(({ message }, i) => `[ ${i + 1} ] ${message}`).join(" ");
    throw new Error(`ConfigurationProvider: ${message}`);
  }

  return Object.fromEntries(rights(parsed)) as Configuration;
};

const parseConfigurationEntry = ([key, source]: [ConfigurationKey, string]): Either<
  Error,
  [ConfigurationKey, URL]
> => {
  const candidate: any = process.env[source];
  try {
    return right([key, new URL(candidate)]);
  } catch {
    return left(
      new Error(`Failed to construct "${key}" URL, "${candidate}" is not a valid URL.`)
    );
  }
};

export const useConfiguration = () => useContext(ConfigurationContext);
