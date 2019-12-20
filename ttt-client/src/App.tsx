import { Card } from "@blueprintjs/core";
import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import styled from "styled-components";
import { Loading } from "./common/loading";
import { useAuthentication } from "./hooks/use-authentication";
import { Ping } from "./ping";
import { Splash } from "./splash";
import { Whoami } from "./whoami";
import { Game } from "./game";

export const App: React.FC = () => {
  const isAuthenticated = useAuthentication();
  return <Layout>{isAuthenticated ? <Routes /> : <Loading />}</Layout>;
};

const Routes: React.FC = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact>
        <Splash />
      </Route>

      <Route path="/whoami" exact>
        <Whoami />
      </Route>

      <Route path="/ping" exact>
        <Ping />
      </Route>

      <Route path="/game/:gameId">
        <Game />
      </Route>
    </Switch>
  </BrowserRouter>
);

const Layout = styled(Card)`
  width: 300px;
  height: 300px;
  display: grid;
  margin: auto;
  overflow: hidden;
`;
