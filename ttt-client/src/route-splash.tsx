import { Button } from "@blueprintjs/core";
import { assertNever } from "@grancalavera/ttt-core";
import React from "react";
import { Redirect } from "react-router-dom";
import {
  ACTIVITY_FAILED,
  ACTIVITY_IDLE,
  ACTIVITY_LOADING,
  ACTIVITY_SUCCESS,
  isLoading,
} from "./common/activity-state";
import { Content } from "./common/layout";
import { useChannelJoinGameMutation } from "./generated/graphql";
import { useActivityState } from "./hooks/use-activity-state";
import { useLoader } from "./hooks/use-loader";

export const SplashRoute: React.FC = () => {
  const [channelJoinGame, channelJoinGameResult] = useChannelJoinGameMutation();
  const { toggleLoader } = useLoader();

  const joinState = useActivityState(channelJoinGameResult);
  toggleLoader(isLoading(joinState));

  // if we have not joined a game, we join a game
  // and wait for the first message on the channel
  // something like "game changed" with a game payload
  // probable on "play", which is just "channelJoinGame"
  // we can just navigate to the game route, if we don't have
  // a game id... no it doesn't work
  switch (joinState.kind) {
    case ACTIVITY_IDLE:
      return (
        <Content>
          <Button
            icon="play"
            onClick={() => channelJoinGame({ variables: { channelId: "some channel" } })}
          />
        </Content>
      );
    case ACTIVITY_LOADING:
      return null;
    case ACTIVITY_FAILED:
      throw joinState.error;
    case ACTIVITY_SUCCESS:
      return <Redirect to={`/game/${joinState.data.channelJoinGame}`} push />;
    default:
      return assertNever(joinState);
  }
};
