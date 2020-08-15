import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { GameView } from "./game-view";
import { useOpenGameMutation } from "./generated/graphql";
import { mutationResultToTask } from "./mutation-result-to-task";
import * as task from "./task-state";

export const GameRoute: React.FC = () => {
  const [openGame, openGameResult] = useOpenGameMutation();

  const openGameTask = mutationResultToTask(openGameResult);

  useEffect(() => {
    openGame();
  }, [openGame]);

  if (task.didFail(openGameTask)) {
    return <Redirect to="/" />;
  }

  if (task.didSucceed(openGameTask)) {
    return <GameView channelId={openGameTask.data.openGame.channelId} />;
  }

  return null;
};
