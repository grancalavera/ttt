import { Button, Intent } from "@blueprintjs/core";
import React, { useState } from "react";
import { BoardLayout, CellLayout } from "./common/layout";
import { GameStatus, Move, Position, Token } from "./generated/graphql";

interface Props {
  status: GameStatus;
}

export const GameView: React.FC<Props> = ({ status }) => {
  const [state, setState] = useState(status);

  return (
    <BoardLayout>
      {initialState(state.me).map(cellState => (
        <PlayButton
          key={keyFromCell(cellState)}
          onPlay={m => console.log(m)}
          move={cellState.move}
        />
      ))}
    </BoardLayout>
  );
};

const PlayButton: React.FC<{ move: Move; onPlay(move: Move): void }> = ({
  move,
  onPlay,
}) => {
  const handleOnClick = () => onPlay(move);
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
