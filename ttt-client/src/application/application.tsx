import { ActionBar, Background, Layout } from "common";
import { GameRoute } from "game";
import { Loading, useLoading } from "loader";
import { MenuRoute } from "menu";
import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useAuthentication } from "security";

export const Application: React.FC = () => {
  const authenticated = useAuthentication();

  const { toggleLoading: toggleLoader } = useLoading();
  toggleLoader(!authenticated);

  return (
    <>
      <ActionBar />
      <Layout>
        <Background />
        {authenticated && <AppRouter />}
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
