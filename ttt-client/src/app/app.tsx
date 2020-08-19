import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { MenuContainer } from "../game/menu-container";
import { PlayGameContainer } from "../game/play-game-container";
import { NetworkProvider } from "../network/net-provider";
import { routes } from "./app-constants";
import { ThemeProvider } from "./theme";
import { ToggleTheme } from "./toggle-theme";

export const App: React.FC = () => {
  return (
    <NetworkProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Switch>
            <Route exact path={`${routes.game}/:id`} component={PlayGameContainer} />
            <Route component={MenuContainer} />
          </Switch>
        </BrowserRouter>
        <ToggleTheme />
      </ThemeProvider>
    </NetworkProvider>
  );
};
