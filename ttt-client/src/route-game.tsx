import { assertNever } from "@grancalavera/ttt-core";
import React, { useContext, useEffect } from "react";
import { Redirect, useParams } from "react-router-dom";
import { AppContext } from "./app-context";
import {
  ACTIVITY_FAILED,
  ACTIVITY_IDLE,
  ACTIVITY_LOADING,
  ACTIVITY_SUCCESS,
  didSucceed,
  isLoading,
} from "./common/activity-state";
import { GameView } from "./game-view";
import { useGameStatusQuery } from "./generated/graphql";
import { useActivityState } from "./hooks/use-activity-state";
import { useLoader } from "./hooks/use-loader";

interface GameRouteParams {
  gameId: string;
}

export const GameRoute: React.FC = () => {
  const { gameId } = useParams<GameRouteParams>();
  const { setToken, setGameId } = useContext(AppContext);

  const gameStatusQueryResult = useGameStatusQuery({
    variables: { gameId },
    fetchPolicy: "no-cache",
  });

  const gameStatusQueryState = useActivityState(gameStatusQueryResult);

  useLoader(isLoading(gameStatusQueryState));

  useEffect(() => setGameId(gameId));

  useEffect(() => {
    if (didSucceed(gameStatusQueryState)) {
      setToken(gameStatusQueryState.data.gameStatus.me);
    }
  }, [gameStatusQueryState, gameId, setGameId, setToken]);

  if (!gameId) {
    console.error("missing required `gameId`");
    return <Redirect to="/" />;
  }

  switch (gameStatusQueryState.kind) {
    case ACTIVITY_IDLE:
    case ACTIVITY_LOADING:
      return null;
    case ACTIVITY_FAILED:
      console.error(gameStatusQueryState.error);
      return <Redirect to="/" />;
    case ACTIVITY_SUCCESS:
      return <GameView gameState={gameStatusQueryState.data.gameStatus} />;
    default:
      return assertNever(gameStatusQueryState);
  }
};
