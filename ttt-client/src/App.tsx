import { Button } from "@blueprintjs/core";
import "@blueprintjs/core/lib/css/blueprint.css";
import { assertNever } from "@grancalavera/ttt-core";
import React, { FC, useEffect } from "react";
import {
  BrowserRouter,
  Link,
  Route,
  Switch,
  RouteComponentProps
} from "react-router-dom";
import {
  useJoinMutation,
  usePingQuery,
  useRegisterMutation,
  useWhoamiQuery
} from "./generated/graphql";
import { useRefreshToken } from "./hooks/useRefreshToken";

export const App: FC = () => {
  const authStatus = useRefreshToken();

  switch (authStatus) {
    case "loading":
      return <Loading />;
    case "authorized":
      return <Routes />;
    case "unauthorized":
      return <Register />;
    default:
      return assertNever(authStatus);
  }
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
  const handleJoin = () => {
    join();
  };

  return (
    <div>
      <p>All good, you can play now.</p>
      {data ? (
        <p>This is the game :P</p>
      ) : (
        <p>
          <Button text="Play" onClick={handleJoin} />
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

const Register: FC = () => {
  const [register] = useRegisterMutation();

  const handleRegister = async () => {
    const response = await register();
    if (response.data) {
      console.log(response.data.register.accessToken);
    } else {
      throw new Error("registration failed");
    }
  };

  useEffect(() => {
    handleRegister();
  }, []);

  return <Loading />;
};

const Loading: FC = () => <div>Loading...</div>;
const LinkHome: FC = () => <Link to="/">OK</Link>;
