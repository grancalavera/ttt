import React, { useContext } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { AppContext } from "./app-context";
import { ActionBar } from "./common/action-bar";
import { Background } from "./common/background";
import { Layout } from "./common/layout";
import { Loading } from "./common/loading";
import { GameRoute } from "./route-game";
import { SplashRoute } from "./route-splash";
import { useLoader } from "./hooks/use-loader";

export const App: React.FC = () => {
  const { authenticated } = useContext(AppContext);

  useLoader(!authenticated);

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
        <SplashRoute />
      </Route>
      <Route path="/game/:gameId">
        <GameRoute />
      </Route>
    </Switch>
  </BrowserRouter>
);
