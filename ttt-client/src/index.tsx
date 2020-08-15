import "@blueprintjs/core/lib/css/blueprint.css";
import { Application } from "./application";
import { AppErrorHandler } from "./fatal-error-handler";
import { ThemeProvider } from "./theme";
import { ToggleTheme } from "./toggle-theme";
import { NetworkProvider } from "./network-context";
import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";

ReactDOM.unstable_createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppErrorHandler>
      <ThemeProvider>
        <NetworkProvider>
          <Application />
          <ToggleTheme />
        </NetworkProvider>
      </ThemeProvider>
    </AppErrorHandler>
  </React.StrictMode>
);
