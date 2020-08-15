import { Background } from "./background";
import { Layout } from "./layout";
import { GameRoute } from "./game-route";
import { MenuRoute } from "./menu-route";
import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

export const Application: React.FC = () => {
  return (
    <Layout>
      <Background />
      <AppRouter />
    </Layout>
  );
};

export const AppRouter: React.FC = () => (
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
