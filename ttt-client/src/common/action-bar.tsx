import { Alignment, Button, Navbar } from "@blueprintjs/core";
import React, { useContext, useEffect, useState } from "react";
import { getAccessToken } from "../access-token";
import { AppContext } from "../app-context";
import { WhoAmI } from "./who-am-i";

const copyToClipboard = (o: Object | undefined) => () => {
  if (o === undefined) {
    return;
  }

  const result = JSON.stringify(o, null, 2);
  console.log(result);
  navigator.clipboard.writeText(result);
};

export const ActionBar: React.FC = () => {
  const { token, gameId, authenticated } = useContext(AppContext);
  const [authHeader, setAuthHeader] = useState<Object | undefined>();
  const [gameStatusVars, setGameStatusVars] = useState<Object | undefined>("");
  const [playVars, setPlayVars] = useState<Object | undefined>();

  useEffect(() => {
    if (authenticated) {
      setAuthHeader({ authorization: `bearer ${getAccessToken()}` });
    }

    if (gameId) {
      setGameStatusVars({ gameId });
    }

    if (gameId && token) {
      setPlayVars({
        input: {
          gameId,
          token,
          position: "A",
        },
      });
    }
  }, [authenticated, setAuthHeader, gameId, setGameStatusVars, token, setPlayVars]);

  return (
    <Navbar fixedToTop>
      <Navbar.Group align={Alignment.LEFT}>
        <Button
          minimal={true}
          disabled={!authHeader}
          onClick={copyToClipboard(authHeader)}
        >
          Copy Authorization Header
        </Button>

        <Button
          minimal={true}
          disabled={!gameStatusVars}
          onClick={copyToClipboard(gameStatusVars)}
        >
          Copy GameStatus Variables
        </Button>

        <Button minimal={true} disabled={!playVars} onClick={copyToClipboard(playVars)}>
          Copy Play Variables
        </Button>

        <Navbar.Divider />

        <WhoAmI />
      </Navbar.Group>
    </Navbar>
  );
};
