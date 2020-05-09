import { ActionBar, Background, Layout } from "common";
import { GameRoute } from "game";
import { Loading, useLoading } from "loader";
import { MenuRoute } from "menu";
import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useAuthentication } from "security";
import { useApplication } from "./application-context";

export const Application: React.FC = () => {
  useAuthentication();
  const { isAuthenticated } = useApplication();

  const { toggleLoading: toggleLoader } = useLoading();
  toggleLoader(!isAuthenticated);

  return (
    <>
      <ActionBar />
      <Layout>
        <Background />
        {isAuthenticated && <AppRouter />}
        <Loading />
      </Layout>
    </>
  );
};

const AppRouter: React.FC = () => (
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
