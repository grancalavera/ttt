import React from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import { NetworkProvider } from "../network/net-provider";
import { ThemeProvider } from "./theme";
import { ToggleTheme } from "./toggle-theme";
import { Layer } from "../layout/layout";

export const App: React.FC = () => {
  return (
    <NetworkProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Switch>
            <Layer></Layer>
          </Switch>
        </BrowserRouter>
        <ToggleTheme />
      </ThemeProvider>
    </NetworkProvider>
  );
};
