import "@blueprintjs/core/lib/css/blueprint.css";
import { Application } from "application";
import { GlobalStyle } from "common";
import { TTTThemeProvider } from "common/theme";
import { ToggleTheme } from "common/toggle-theme";
import { FatalErrorHandler } from "error";
import { NetworkProvider } from "network";
import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";

ReactDOM.unstable_createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GlobalStyle />
    <TTTThemeProvider>
      <FatalErrorHandler title="Fatal Error">
        <NetworkProvider>
          <Application />
          <ToggleTheme />
        </NetworkProvider>
      </FatalErrorHandler>
    </TTTThemeProvider>
  </React.StrictMode>
);
