import React, { useContext } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { AppContext } from "./app-context";
import { Background } from "./common/background";
import { Layout } from "./common/layout";
import { Loading } from "./common/loading";
import { WhoAmI } from "./common/who-am-i";
import { GameRoute } from "./route-game";
import { SplashRoute } from "./route-splash";

export const App: React.FC = () => {
  const { authenticated } = useContext(AppContext);

  // setLoading(!authenticated);

  return (
    <>
      <WhoAmI />
      <Layout>
        <Background />
        {authenticated && (
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
        <Loading />
      </Layout>
    </>
  );
};
