import React, { useContext, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Board } from "./common/board";
import { Layout } from "./common/layout";
import { Loading } from "./common/loading";
import { GameRoute } from "./game";
import { useAuthentication } from "./hooks/use-authentication";
import { Ping } from "./ping";
import { Splash } from "./splash";
import { AppContext, TTTApp } from "./app-context";

export const App: React.FC = () => (
  <TTTApp>
    <TTT />
  </TTTApp>
);

const TTT: React.FC = () => {
  const isAuthenticated = useAuthentication();
  const { isLoading, setIsLoading } = useContext(AppContext);

  useEffect(() => {
    setIsLoading(!isAuthenticated);
  }, [isAuthenticated, setIsLoading]);

  return (
    <Layout>
      <Board />
      {isAuthenticated && <Routes />}
      <Loading isLoading={isLoading} />
    </Layout>
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
