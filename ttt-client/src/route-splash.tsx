import { Button } from "@blueprintjs/core";
import { assertNever } from "@grancalavera/ttt-core";
import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import { AppContext } from "./app-context";
import {
  activityState,
  ACTIVITY_FAILED,
  ACTIVITY_IDLE,
  ACTIVITY_LOADING,
  ACTIVITY_SUCCESS,
  isLoading,
} from "./common/activity-state";
import { Content } from "./common/layout";
import { useJoinMutation } from "./generated/graphql";

export const SplashRoute: React.FC = () => {
  const { setLoading } = useContext(AppContext);
  const [join, mResult] = useJoinMutation();

  const mState = activityState(mResult);
  setLoading(isLoading(mState));

  switch (mState.kind) {
    case ACTIVITY_IDLE:
      return (
        <Content>
          <Button icon="play" onClick={() => join()} />
        </Content>
      );
    case ACTIVITY_LOADING:
      return null;
    case ACTIVITY_FAILED:
      throw mState.error;
    case ACTIVITY_SUCCESS:
      return <Redirect to={`/game/${mState.data.join}`} push />;
    default:
      return assertNever(mState);
  }
};
