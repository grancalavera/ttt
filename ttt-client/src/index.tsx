import "@blueprintjs/core/lib/css/blueprint.css";
import { Application } from "application";
import { GlobalStyle } from "common";
import { FatalErrorHandler } from "error";
import { NetworkProvider } from "network";
import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";

ReactDOM.unstable_createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GlobalStyle />
    <FatalErrorHandler title="Fatal Error">
      <NetworkProvider>
        <Application />
      </NetworkProvider>
    </FatalErrorHandler>
  </React.StrictMode>
);
