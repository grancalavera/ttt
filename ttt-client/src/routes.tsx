import { Button, Navbar } from "@blueprintjs/core";
import React from "react";
import { BrowserRouter, NavLink, Route, Switch } from "react-router-dom";

export const Routes: React.FC = () => (
  <BrowserRouter>
    <Header />
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/who-am-i">
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
const Whoami: React.FC = () => <>Who Am I?</>;
