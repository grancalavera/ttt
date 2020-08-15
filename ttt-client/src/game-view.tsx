import React, { useEffect, useRef } from "react";
import { Board } from "./board";
import { useBeginGameMutation, useGameChangedSubscription } from "./generated/graphql";
import { hasTypename } from "./with-typename";

interface GameViewProps {
  channelId: string;
}

export const GameView: React.FC<GameViewProps> = ({ channelId }) => {
  const started = useRef(false);
  const input = { variables: { input: { channelId } } };
  const [beginGame] = useBeginGameMutation();
  const { data, loading } = useGameChangedSubscription(input);

  useEffect(() => {
    if (!started.current && !loading) {
      started.current = true;
      beginGame(input);
    }
  }, [beginGame, input, loading]);

  const gameState = data?.gameChanged.state;

  return hasTypename(gameState) ? <Board {...{ gameState }} /> : null;
};
