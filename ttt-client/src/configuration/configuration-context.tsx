import React, { useContext } from "react";
import { failProxy } from "../common/fail-proxy";
import { FatalErrorHandler } from "../error/fatal-error-handler";

interface Configuration {
  readonly graphqlEndpoint: URL;
  readonly refreshJWTEndpoint: URL;
}

interface ConfigurationContextProps {
  graphqlEndpoint: any;
  refreshJWTEndpoint: any;
}

const ConfigurationContext = React.createContext<Configuration>(
  failProxy("Configuration")
);

export const ConfigurationProvider: React.FC<ConfigurationContextProps> = ({
  children,
  ...configuration
}) => {
  return (
    <ConfigurationContext.Provider value={parseConfiguration(configuration)}>
      {children}
    </ConfigurationContext.Provider>
  );
};

const parseConfiguration = (props: ConfigurationContextProps): Configuration => {
  const errors: Error[] = [];

  let graphqlEndpoint!: URL;
  let refreshJWTEndpoint!: URL;

  try {
    graphqlEndpoint = parseUrl("graphql endpoint", props.graphqlEndpoint);
  } catch (e) {
    errors.push(e);
  }

  try {
    refreshJWTEndpoint = parseUrl("refresh jwt endpoint", props.refreshJWTEndpoint);
  } catch (e) {
    errors.push(e);
  }

  if (errors.length > 0) {
    const message = errors.map(({ message }, i) => `[ ${i + 1} ] ${message}`).join(" ");
    throw new Error(`ConfigurationProvider: ${message}`);
  } else {
    return { graphqlEndpoint, refreshJWTEndpoint };
  }
};

const parseUrl = (name: string, candidate: any): URL => {
  try {
    return new URL(candidate);
  } catch (e) {
    throw new Error(
      `Failed to construct "${name}" URL, "${candidate}" is not a valid URL.`
    );
  }
};

export const useConfiguration = () => useContext(ConfigurationContext);
