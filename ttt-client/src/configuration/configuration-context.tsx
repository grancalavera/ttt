import React from "react";
import { useContext } from "react";
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
  graphqlEndpoint: gql,
  refreshJWTEndpoint: jwt
}) => {
  // const graphqlEndpoint = new URL(gql);
  // const refreshJWTEndpoint = new URL(jwt);
  return (
    <FatalErrorHandler>
      <ConfigurationContext.Provider value={failProxy("Configuration")}>
        {children}
      </ConfigurationContext.Provider>
    </FatalErrorHandler>
  );
};

export const useConfiguration = () => useContext(ConfigurationContext);
