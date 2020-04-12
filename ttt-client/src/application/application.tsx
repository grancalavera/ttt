import React, { useContext } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { AppContext } from "./application-context";
import { ActionBar } from "../common/action-bar";
import { Background } from "../common/background";
import { Layout } from "../common/layout";
import { GameRoute } from "../game/route";
import { Loading } from "../loader/loading";
import { useLoader } from "../loader/use-loader";
import { MenuRoute } from "../menu/route";

export const Application: React.FC = () => {
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
