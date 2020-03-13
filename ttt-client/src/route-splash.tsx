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
  const [join, joinResult] = useChannelJoinGameMutation();
  const joinState = useActivityState(joinResult);
  const { toggleLoader } = useLoader();

  toggleLoader(isLoading(joinState));

  switch (joinState.kind) {
    case ACTIVITY_IDLE:
      return (
        <Content>
          <Button icon="play" onClick={() => join()} />
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
