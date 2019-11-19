import { Button } from "@blueprintjs/core";
import "@blueprintjs/core/lib/css/blueprint.css";
import React, { FC } from "react";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import {
  useJoinMutation,
  usePingQuery,
  useWhoamiQuery
} from "./generated/graphql";
import { useAuthentication } from "./hooks/use-authentication";

export const App: FC = () => {
  const isAuthenticated = useAuthentication();
  return isAuthenticated ? <Routes /> : <Loading />;
};

const Routes: FC = () => (
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

const TTT: FC = () => {
  const [join, { data }] = useJoinMutation();

  // look into `data`
  // if `token` is equal to `next`
  // then we move to TURN
  // otherwise we move to WAIT

  return (
    <div>
      <p>All good, you can play now.</p>
      {data ? (
        <>
          <p>This is the game:</p>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </>
      ) : (
        <p>
          <Button text="Play" onClick={() => join()} />
        </p>
      )}
    </div>
  );
};

const Whoami: FC = () => {
  const { data, loading, error } = useWhoamiQuery({
    fetchPolicy: "network-only"
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

const Ping: FC = () => {
  const { data, loading, error } = usePingQuery({
    fetchPolicy: "network-only"
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

const Loading: FC = () => <div>Loading...</div>;
const LinkHome: FC = () => <Link to="/">OK</Link>;
