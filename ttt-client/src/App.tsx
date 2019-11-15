import "@blueprintjs/core/lib/css/blueprint.css";
import React, { FC } from "react";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import { usePingQuery, useWhoamiQuery } from "./generated/graphql";
import { useRefreshToken } from "./hooks/useRefreshToken";

export const App: React.FC = () => {
  const loading = useRefreshToken();
  return loading ? <Loading /> : <Routes />;
};

const Routes: FC = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact>
        <div>All good, you can play now.</div>
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

const Whoami: React.FC = () => {
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

const Ping: React.FC = () => {
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
