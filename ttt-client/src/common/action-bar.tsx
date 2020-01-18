import { Alignment, Button, Navbar } from "@blueprintjs/core";
import React, { useCallback, useContext } from "react";
import { getAccessToken } from "../access-token";
import { AppContext } from "../app-context";
import { WhoAmI } from "./who-am-i";

const copyGraphQLSettings = (o: any) => {
  const result = JSON.stringify(o, null, 2);
  console.log(result);
  navigator.clipboard.writeText(result);
};

export const ActionBar: React.FC = () => {
  const { token, gameId } = useContext(AppContext);

  const copyAccessTokenHeader = useCallback(() => {
    copyGraphQLSettings({ authorization: `bearer ${getAccessToken()}` });
  }, []);

  const copyGameStatusParams = useCallback(() => {
    copyGraphQLSettings({ gameId });
  }, [gameId]);

  const copyPlayParams = useCallback(() => {
    copyGraphQLSettings({
      input: {
        gameId,
        token,
        position: "A",
      },
    });
  }, [gameId, token]);

  return (
    <Navbar fixedToTop>
      <Navbar.Group align={Alignment.LEFT}>
        <WhoAmI />
        <Navbar.Divider />
        <Button minimal={true} onClick={copyAccessTokenHeader}>
          Copy Authorization Header
        </Button>
        <Button minimal={true} onClick={copyGameStatusParams}>
          Copy Game Status Variables
        </Button>
        <Button minimal={true} onClick={copyPlayParams}>
          Copy Play Variables
        </Button>
        <Navbar.Divider />
      </Navbar.Group>
    </Navbar>
  );
};
