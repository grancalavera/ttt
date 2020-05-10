import { Background, Layout } from "common";
import { GameRoute } from "game";
import { Loading } from "loader";
import { MenuRoute } from "menu";
import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
export const Application: React.FC = () => {
  return (
    <>
      <Layout>
        <Background />
        <AppRouter />
        <Loading />
      </Layout>
    </>
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
