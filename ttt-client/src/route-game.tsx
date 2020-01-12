import { Button, Intent } from "@blueprintjs/core";
import { assertNever } from "@grancalavera/ttt-core";
import React, { useCallback, useContext, useEffect } from "react";
import { Redirect, useParams } from "react-router-dom";
import { AppContext } from "./app-context";
import {
  activityState,
  ACTIVITY_FAILED,
  ACTIVITY_IDLE,
  ACTIVITY_LOADING,
  ACTIVITY_SUCCESS,
  didSucceed,
  isLoading,
} from "./common/activity-state";
import { BoardLayout, CellLayout } from "./common/layout";
import { Move, Position, Token, useGameStatusQuery } from "./generated/graphql";

interface GameRouteParams {
  gameId: string;
}

export const GameRoute: React.FC = () => {
  const { gameId } = useParams<GameRouteParams>();
  const { setLoading, setToken, setGameId } = useContext(AppContext);

  const queryResult = useGameStatusQuery({
    variables: { gameId },
    fetchPolicy: "no-cache",
  });

  const queryState = activityState(queryResult);
  const loading = isLoading(queryState);

  useEffect(() => {
    setLoading(loading);
    if (didSucceed(queryState)) {
      setToken(queryState.data.gameStatus.me);
      setGameId(gameId);
    }
  }, [setLoading, loading, queryState, gameId, setGameId, setToken]);

  if (!gameId) {
    console.error("missing required `gameId`");
    return <Redirect to="/" />;
  }

  switch (queryState.kind) {
    case ACTIVITY_IDLE:
    case ACTIVITY_LOADING:
      return null;
    case ACTIVITY_FAILED:
      console.error(queryState.error);
      return <Redirect to="/" />;
    case ACTIVITY_SUCCESS: {
      return (
        <BoardLayout>
          {initialState(queryState.data.gameStatus.me).map(cellState => (
            <PlayButton
              key={keyFromCell(cellState)}
              onPlay={m => console.log(m)}
              move={cellState.move}
            />
          ))}
        </BoardLayout>
      );
    }
    default:
      return assertNever(queryState);
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

const initialState = (token: Token): CellState[] =>
  [...Array(9)].map((_, i) => ({
    isFree: true,
    move: { position: indexToPosition(i), token },
  }));

const indexToPosition = (i: number): Position => String.fromCharCode(65 + i) as Position;

const keyFromCell = ({ move: { position, token } }: CellState) => `${position}-${token}`;
