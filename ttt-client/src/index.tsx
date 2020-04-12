import "@blueprintjs/core/lib/css/blueprint.css";
import React from "react";
import ReactDOM from "react-dom";
import { Application } from "./application/application";
import { ApplicationProvider } from "./application/application-context";
import { ConfigurationProvider } from "./configuration/configuration-context";
import "./index.scss";
import { NetworkProvider } from "./network/network-context";
import { SecurityProvider } from "./security/security-context";

ReactDOM.render(
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
  </ConfigurationProvider>,
  document.getElementById("root")
);
