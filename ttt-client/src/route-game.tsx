import { Button, Intent } from "@blueprintjs/core";
import { assertNever } from "@grancalavera/ttt-core";
import React, { useCallback, useContext } from "react";
import { Redirect, useParams } from "react-router-dom";
import { RouteContext } from "./app-context";
import {
  activityState,
  ACTIVITY_FAILED,
  ACTIVITY_IDLE,
  ACTIVITY_LOADING,
  ACTIVITY_SUCCESS,
  isLoading,
} from "./common/activity-state";
import { BoardLayout, CellLayout } from "./common/layout";
import { Move, Position, Token, useGameStatusQuery } from "./generated/graphql";

interface GameRouteParams {
  gameId: string;
}

export const GameRoute: React.FC = () => {
  const { gameId } = useParams<GameRouteParams>();
  const { setLoading } = useContext(RouteContext);

  const qResult = useGameStatusQuery({
    variables: { gameId },
    fetchPolicy: "no-cache",
  });

  const qState = activityState(qResult);
  const loading = isLoading(qState);
  setLoading(loading);

  if (!gameId) {
    console.error("missing required `gameId`");
    return <Redirect to="/" />;
  }

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
        <BoardLayout>
          {defaultState(qState.data.gameStatus.me).map(cellState => (
            <PlayButton
              key={keyFromCell(cellState)}
              onPlay={m => console.log(m)}
              move={cellState.move}
            />
          ))}
        </BoardLayout>
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
    <CellLayout>
      <Button intent={Intent.PRIMARY} minimal onClick={handleOnClick} />
    </CellLayout>
  );
};

interface CellState {
  move: Move;
  isFree: boolean;
}

const defaultState = (token: Token): CellState[] =>
  [...Array(9)].map((_, i) => ({
    isFree: true,
    move: { position: indexToPosition(i), token },
  }));

const indexToPosition = (i: number): Position => String.fromCharCode(65 + i) as Position;

const keyFromCell = ({ move: { position, token } }: CellState) => `${position}-${token}`;
