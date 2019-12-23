import React, { useContext, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import styled from "styled-components/macro";
import { AppContext, TTTApp } from "./app-context";
import { Background } from "./common/background";
import { Layout } from "./common/layout";
import { Loading } from "./common/loading";
import { useWhoamiLazyQuery } from "./generated/graphql";
import { useAuthentication } from "./hooks/use-authentication";
import { GameRoute } from "./route-game";
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
    <>
      <WhoAmI isAuthenticated={isAuthenticated} />
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
    </>
  );
};

const WhoAmI: React.FC<{ isAuthenticated: boolean }> = ({
  isAuthenticated,
}) => {
  const [runWhoAmI, { data }] = useWhoamiLazyQuery({
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (isAuthenticated) {
      runWhoAmI();
    }
  }, [runWhoAmI, isAuthenticated]);

  return data ? (
    <Floaty className="bp3-text-small">{data.whoami}</Floaty>
  ) : null;
};

const Floaty = styled.code`
  position: absolute;
`;
