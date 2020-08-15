import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { GameRoute } from "./game-route";
import { MenuRoute } from "./menu-route";

export const Application: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact>
          <MenuRoute />
        </Route>
        <Route path="/game">
          <GameRoute />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};
