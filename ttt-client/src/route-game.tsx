import { assertNever } from "@grancalavera/ttt-core";
import React, { useContext } from "react";
import { Redirect, useParams } from "react-router-dom";
import { AppContext } from "./app-context";
import {
  activityState,
  ACTIVITY_FAILED,
  ACTIVITY_IDLE,
  ACTIVITY_LOADING,
  ACTIVITY_SUCCESS,
} from "./common/activity-state";
import { Board, Cell } from "./common/layout";
import { useGameStatusQuery } from "./generated/graphql";
import { Button, Intent } from "@blueprintjs/core";

interface GameRouteParams {
  gameId: string;
}

export const GameRoute: React.FC = () => {
  const { gameId } = useParams<GameRouteParams>();
  const { setLoadingFromActivity } = useContext(AppContext);
  const qResult = useGameStatusQuery({
    variables: { gameId },
    fetchPolicy: "no-cache",
  });

  if (!gameId) {
    console.error("missing required `gameId`");
    return <Redirect to="/" />;
  }

  const qState = activityState(qResult);

  setLoadingFromActivity(qState);

  switch (qState.kind) {
    case ACTIVITY_IDLE:
    case ACTIVITY_LOADING:
      return null;
    case ACTIVITY_FAILED:
      console.error(qState.error);
      return <Redirect to="/" />;
    case ACTIVITY_SUCCESS:
      console.log(JSON.stringify(qState.data.gameStatus, null, 2));
      return (
        <Board>
          <Cell>
            <Button
              intent={Intent.PRIMARY}
              minimal
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                e.preventDefault();
              }}
            ></Button>
          </Cell>
          <Cell>
            <Button intent={Intent.PRIMARY} minimal></Button>
          </Cell>
          <Cell>
            <Button intent={Intent.PRIMARY} minimal></Button>
          </Cell>
          <Cell>
            <Button intent={Intent.PRIMARY} minimal></Button>
          </Cell>
          <Cell>
            <Button intent={Intent.PRIMARY} minimal></Button>
          </Cell>
          <Cell>
            <Button intent={Intent.PRIMARY} minimal></Button>
          </Cell>
          <Cell>
            <Button intent={Intent.PRIMARY} minimal></Button>
          </Cell>
          <Cell>
            <Button intent={Intent.PRIMARY} minimal></Button>
          </Cell>
          <Cell>
            <Button intent={Intent.PRIMARY} minimal></Button>
          </Cell>
        </Board>
      );
    default:
      return assertNever(qState);
  }
};
