import { Button, Intent, Spinner, Card } from "@blueprintjs/core";
import React from "react";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import styled from "styled-components/macro";
import {
  useJoinMutation,
  usePingQuery,
  useWhoamiQuery,
} from "./generated/graphql";
import { useAuthentication } from "./hooks/use-authentication";

export const App: React.FC = () => {
  const isAuthenticated = useAuthentication();
  return <CardLayout>{isAuthenticated ? <Routes /> : <Loading />}</CardLayout>;
};

const Routes: React.FC = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact>
        <TTT />
      </Route>

      <Route path="/whoami" exact>
        <Whoami />
      </Route>

      <Route path="/ping" exact>
        <Ping />
      </Route>
    </Switch>
  </BrowserRouter>
);

const TTT: React.FC = () => {
  const [join, { data, loading }] = useJoinMutation();

  // look into `data`
  // if `token` is equal to `next`
  // then we move to TURN
  // otherwise we move to WAIT
  return data ? (
    <pre>{JSON.stringify(data, null, 2)}</pre>
  ) : (
    <Centered>
      {loading ? <Loading /> : <Button icon="play" onClick={() => join()} />}
    </Centered>
  );
};

const Whoami: React.FC = () => {
  const { data, loading, error } = useWhoamiQuery({
    fetchPolicy: "network-only",
  });

  if (error) throw error;
  if (loading) return <Loading />;
  if (data)
    return (
      <>
        <div>{data.whoami}</div>
        <div>
          <LinkHome />
        </div>
      </>
    );
  throw new Error("undefined query state");
};

const Ping: React.FC = () => {
  const { data, loading, error } = usePingQuery({
    fetchPolicy: "network-only",
  });

  if (error) throw error;
  if (loading) return <Loading />;
  if (data)
    return (
      <>
        <div>{data.ping}</div>
        <div>
          <LinkHome />
        </div>
      </>
    );
  throw new Error("undefined query state");
};

const Loading: React.FC = () => (
  <Spinner intent={Intent.PRIMARY} size={Spinner.SIZE_SMALL} />
);

const LinkHome: React.FC = () => <Link to="/">OK</Link>;

const Centered = styled.div`
  margin: auto;
`;

const CardLayout = styled(Card)`
  width: 300px;
  height: 300px;
  display: grid;
  margin: auto;
  overflow: hidden;
`;
