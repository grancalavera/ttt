import React, { useEffect, useRef } from "react";
import { hasTypename } from "../common/with-typename";
import { useBeginGameMutation, useGameChangedSubscription } from "../generated/graphql";
import { useLoader } from "../hooks/use-loader";
import { Board } from "./board";

interface GameViewProps {
  channelId: string;
}

export const GameView: React.FC<GameViewProps> = ({ channelId }) => {
  const started = useRef(false);
  const input = { variables: { input: { channelId } } };
  const [beginGame] = useBeginGameMutation();
  const { data, loading } = useGameChangedSubscription(input);
  const { toggleLoader } = useLoader();

  useEffect(() => {
    if (!started.current && !loading) {
      started.current = true;
      beginGame(input);
    }
  }, [beginGame, input, loading]);

  toggleLoader(loading);
  const gameState = data?.gameChanged.state;

  return hasTypename(gameState) ? <Board {...{ gameState }} /> : null;
};
