import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import * as task from "task";
import { useApolloTask } from "task";
import { useOpenGameMutation } from "generated/graphql";
import { useLoading } from "loader";
import { GameView } from "game/view";

export const GameRoute: React.FC = () => {
  const [openGame, openGameResult] = useOpenGameMutation();
  const { toggleLoading } = useLoading();

  const openGameTask = useApolloTask(openGameResult);

  useEffect(() => {
    openGame();
  }, [openGame]);

  toggleLoading(task.isLoading(openGameTask));

  if (task.didFail(openGameTask)) {
    return <Redirect to="/" />;
  }

  if (task.didSucceed(openGameTask)) {
    return <GameView channelId={openGameTask.data.openGame.channelId} />;
  }

  return null;
};
