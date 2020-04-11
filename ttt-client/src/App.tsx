import React, { useContext } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { AppContext } from "./app-context";
import { ActionBar } from "./common/action-bar";
import { Background } from "./common/background";
import { Layout } from "./common/layout";
import { Loading } from "./common/loading";
import { GameRoute } from "./game/route";
import { useLoader } from "./hooks/use-loader";
import { MenuRoute } from "./menu/route";

export const App: React.FC = () => {
  const { authenticated } = useContext(AppContext);
  const { toggleLoader } = useLoader();

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
