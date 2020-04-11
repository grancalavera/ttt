import { assertNever } from "@grancalavera/ttt-core";
import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { isLoading } from "../common/activity-state";
import { useOpenGameMutation } from "../generated/graphql";
import { useActivityState } from "../hooks/use-activity-state";
import { useLoader } from "../hooks/use-loader";
import { GameView } from "./view";

export const GameRoute: React.FC = () => {
  const [openGame, openGameResult] = useOpenGameMutation();
  const { toggleLoader } = useLoader();

  const openGameState = useActivityState(openGameResult);
  toggleLoader(isLoading(openGameState));

  useEffect(() => {
    openGame();
  }, [openGame]);

  switch (openGameState.kind) {
    case "ACTIVITY_IDLE":
    case "ACTIVITY_LOADING":
      return null;
    case "ACTIVITY_FAILED":
      return <Redirect to="/" />;
    case "ACTIVITY_SUCCESS": {
      const { channelId } = openGameState.data.openGame;
      return <GameView channelId={channelId} />;
    }
    default:
      assertNever(openGameState);
  }
};
