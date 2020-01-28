import { assertNever } from "@grancalavera/ttt-core";
import React, { useContext, useEffect } from "react";
import { Redirect, useParams } from "react-router-dom";
import { AppContext } from "./app-context";
import {
  activityState,
  ACTIVITY_FAILED,
  ACTIVITY_IDLE,
  ACTIVITY_LOADING,
  ACTIVITY_SUCCESS,
  didSucceed,
  isLoading,
} from "./common/activity-state";
import { GameView } from "./game-view";
import { useGameStatusQuery } from "./generated/graphql";

interface GameRouteParams {
  gameId: string;
}

export const GameRoute: React.FC = () => {
  const { gameId } = useParams<GameRouteParams>();
  const { setLoading, setToken, setGameId } = useContext(AppContext);

  const gameStatusQueryResult = useGameStatusQuery({
    variables: { gameId },
    fetchPolicy: "no-cache",
  });

  const gameStatusQueryState = activityState(gameStatusQueryResult);
  const loading = isLoading(gameStatusQueryState);

  useEffect(() => {
    setLoading(loading);
    if (didSucceed(gameStatusQueryState)) {
      setToken(gameStatusQueryState.data.gameStatus.me);
      setGameId(gameId);
    }
  }, [setLoading, loading, gameStatusQueryState, gameId, setGameId, setToken]);

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
      return <GameView status={gameStatusQueryState.data.gameStatus} />;
    default:
      return assertNever(gameStatusQueryState);
  }
};
