import React, { useContext } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { AppContext, TTTApp } from "./app-context";
import { Background } from "./common/background";
import { Layout } from "./common/layout";
import { Loading } from "./common/loading";
import { GameRoute } from "./route-game";
import { useAuthentication } from "./hooks/use-authentication";
import { SplashRoute } from "./route-splash";

export const App: React.FC = () => (
  <TTTApp>
    <TTT />
  </TTTApp>
);

const TTT: React.FC = () => {
  const isAuthenticated = useAuthentication();
  const { isLoading, setIsLoading } = useContext(AppContext);
  setIsLoading(!isAuthenticated);

  return (
    <Layout>
      <Background />
      {isAuthenticated && (
        <BrowserRouter>
          <Switch>
            <Route path="/" exact>
              <SplashRoute />
            </Route>

            <Route path="/game/:gameId">
              <GameRoute />
            </Route>
          </Switch>
        </BrowserRouter>
      )}
      <Loading isLoading={isLoading} />
    </Layout>
  );
};
