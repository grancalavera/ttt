import "@blueprintjs/core/lib/css/blueprint.css";
import { Application, ApplicationProvider } from "application";
import { ConfigurationProvider } from "configuration";
import { FatalErrorHandler } from "error/fatal-error-handler";
import { NetworkProvider } from "network";
import React from "react";
import ReactDOM from "react-dom";
import { SecurityProvider } from "security";
import "./index.scss";

ReactDOM.render(
  <FatalErrorHandler title="Fatal Error">
    <ConfigurationProvider
      graphqlEndpoint={process.env.REACT_APP_GRAPHQL_ENDPOINT}
      refreshJWTEndpoint={process.env.REACT_APP_REFRESH_JWT_ENDPOINT}
    >
      <SecurityProvider>
        <NetworkProvider>
          <ApplicationProvider>
            <Application />
          </ApplicationProvider>
        </NetworkProvider>
      </SecurityProvider>
    </ConfigurationProvider>
  </FatalErrorHandler>,
  document.getElementById("root")
);
