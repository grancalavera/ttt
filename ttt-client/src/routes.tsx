import { Button, Navbar } from "@blueprintjs/core";
import React from "react";
import { BrowserRouter, NavLink, Route, Switch } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";

export const Routes: React.FC = () => (
  <BrowserRouter>
    <Header />
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/whoami">
        <Whoami />
      </Route>
    </Switch>
  </BrowserRouter>
);

const Header: React.FC = () => (
  <header>
    <Navbar className="bp3-dark">
      <Navbar.Group align="left">
        <Navbar.Heading>ET3</Navbar.Heading>
        <Navbar.Divider />
        <NavLink to="/">
          <Button className="bp3-button bp3-minimal">home</Button>
        </NavLink>
        <NavLink to="whoami">
          <Button className="bp3-button bp3-minimal">whoami</Button>
        </NavLink>
      </Navbar.Group>
    </Navbar>
  </header>
);

const Home: React.FC = () => <>Home</>;
const Whoami: React.FC = () => {
  const { data, loading, error } = useQuery(
    gql`
      query Whoami {
        whoami
      }
    `,
    { fetchPolicy: "network-only" }
  );

  return (
    <>
      <p>Who Am I?</p>
      {error ? <>Not Authorized</> : loading ? <>Loading...</> : <>{data.whoami}</>}
    </>
  );
};
