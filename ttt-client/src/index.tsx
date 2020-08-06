import "@blueprintjs/core/lib/css/blueprint.css";
import { Application, ApplicationProvider } from "application";
import { FatalErrorHandler } from "error";
import { NetworkProvider } from "network";
import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";

ReactDOM.unstable_createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <FatalErrorHandler title="Fatal Error">
      <ApplicationProvider>
        <NetworkProvider>
          <Application />
        </NetworkProvider>
      </ApplicationProvider>
    </FatalErrorHandler>
  </React.StrictMode>
);
