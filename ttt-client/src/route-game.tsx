import { Button, Intent } from "@blueprintjs/core";
import { assertNever } from "@grancalavera/ttt-core";
import React from "react";
import { Redirect, useParams } from "react-router-dom";
import {
  activityState,
  ACTIVITY_FAILED,
  ACTIVITY_IDLE,
  ACTIVITY_LOADING,
  ACTIVITY_SUCCESS,
} from "./common/activity-state";
import { Board, Cell } from "./common/layout";
import { Token, useGameStatusQuery, Move, Position } from "./generated/graphql";
import { useCallback } from "react";
import { useContext } from "react";
import { AppContext } from "./app-context";

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

  const qState = activityState(qResult);

  if (!gameId) {
    console.error("missing required `gameId`");
    return <Redirect to="/" />;
  }

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
          {defaultState(qState.data.gameStatus.me).map(move => (
            <PlayButton
              key={keyFromMove(move)}
              onPlay={m => console.log(m)}
              move={move}
            />
          ))}
        </Board>
      );
    default:
      return assertNever(qState);
  }
};

const PlayButton: React.FC<{ move: Move; onPlay(move: Move): void }> = ({
  move,
  onPlay,
}) => {
  const handleOnClick = useCallback(() => onPlay(move), [move, onPlay]);
  return (
    <Cell>
      <Button intent={Intent.PRIMARY} minimal onClick={handleOnClick} />
    </Cell>
  );
};

const defaultState = (token: Token): Move[] =>
  [...Array(9)].map((_, i) => ({ position: indexToPosition(i), token }));

const indexToPosition = (i: number): Position => String.fromCharCode(65 + i) as Position;

const keyFromMove = ({ position, token }: Move) => `${position}-${token}`;
