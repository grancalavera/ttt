import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Board } from "./common/board";
import { Content, Layout } from "./common/layout";
import { Loading } from "./common/loading";
import { GameRoute } from "./game";
import { useAuthentication } from "./hooks/use-authentication";
import { Ping } from "./ping";
import { Splash } from "./splash";

export const App: React.FC = () => {
  const isAuthenticated = useAuthentication();

  // add a context to show/hide loading spinner
  return (
    <>
      <Layout>
        <Board />
        <Content />
        <Loading isLoading={!isAuthenticated} />
      </Layout>
    </>
  );
};

const Routes: React.FC = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact>
        <Splash />
      </Route>

      <Route path="/ping" exact>
        <Ping />
      </Route>

      <Route path="/game/:gameId">
        <GameRoute />
      </Route>
    </Switch>
  </BrowserRouter>
);
