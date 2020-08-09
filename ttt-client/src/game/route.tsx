import { GameView } from "game/view";
import { useOpenGameMutation } from "generated/graphql";
import { useLoading } from "loader";
import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import * as task from "task";
import { mutationResultToTask } from "task";

export const GameRoute: React.FC = () => {
  const [openGame, openGameResult] = useOpenGameMutation();
  const { toggleLoading } = useLoading();

  const openGameTask = mutationResultToTask(openGameResult);

  useEffect(() => {
    openGame();
  }, [openGame]);

  useEffect(() => {
    toggleLoading(task.isLoading(openGameTask));
  }, [toggleLoading, openGameTask]);

  if (task.didFail(openGameTask)) {
    return <Redirect to="/" />;
  }

  if (task.didSucceed(openGameTask)) {
    return <GameView channelId={openGameTask.data.openGame.channelId} />;
  }

  return null;
};
