import { Alignment, Button, Navbar } from "@blueprintjs/core";
import { Maybe } from "@grancalavera/ttt-core";
import { useApplication } from "application";
import React, { useEffect, useState } from "react";
import { useSecurity } from "../security/security-context";
import { WhoAmI } from "./who-am-i";

const copyToClipboard = (o: Maybe<object>) => () => {
  if (o === undefined) {
    return;
  }

  const result = JSON.stringify(o, null, 2);
  console.log(result);
  navigator.clipboard.writeText(result);
};

export const ActionBar: React.FC = () => {
  const { isAuthenticated, accessToken } = useSecurity();
  const { token, gameId } = useApplication();
  const [authHeader, setAuthHeader] = useState<Maybe<object>>();
  const [gameStatusVars, setGameStatusVars] = useState<object>();
  const [playVars, setPlayVars] = useState<Maybe<object>>();

  useEffect(() => {
    if (isAuthenticated) {
      setAuthHeader({ authorization: `bearer ${accessToken}` });
    }
  }, [isAuthenticated, accessToken, setAuthHeader]);

  useEffect(() => {
    if (gameId) {
      setGameStatusVars({ gameId });
    }
  }, [gameId, setGameStatusVars]);

  useEffect(() => {
    if (gameId && token) {
      setPlayVars({
        input: {
          gameId,
          token,
          position: "A"
        }
      });
    }
  }, [gameId, token, setPlayVars]);

  return (
    <Navbar fixedToTop className="bp3-text-small">
      <Navbar.Group align={Alignment.LEFT}>
        <Button
          minimal={true}
          disabled={!authHeader}
          onClick={copyToClipboard(authHeader)}
        >
          <code>authorization</code>
        </Button>

        <Button
          minimal={true}
          disabled={!gameStatusVars}
          onClick={copyToClipboard(gameStatusVars)}
          className="bp3-text-small"
        >
          <code>GameStatus</code>
        </Button>

        <Button minimal={true} disabled={!playVars} onClick={copyToClipboard(playVars)}>
          <code>Play</code>
        </Button>

        <Navbar.Divider />
        <WhoAmI />

        {gameId && (
          <>
            <Navbar.Divider />
            <code>{gameId}</code>
          </>
        )}
      </Navbar.Group>
    </Navbar>
  );
};
