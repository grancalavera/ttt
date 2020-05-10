import "@blueprintjs/core/lib/css/blueprint.css";
import { Application, ApplicationProvider } from "application";
import { ConfigurationProvider } from "configuration";
import { FatalErrorHandler } from "error";
import { NetworkProvider } from "network";
import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";

ReactDOM.render(
  <FatalErrorHandler title="Fatal Error">
    <ConfigurationProvider>
      <ApplicationProvider>
        <NetworkProvider>
          <Application />
        </NetworkProvider>
      </ApplicationProvider>
    </ConfigurationProvider>
  </FatalErrorHandler>,
  document.getElementById("root")
);
