import { Button, Intent } from "@blueprintjs/core";
import React, { useState } from "react";
import { BoardLayout, CellLayout } from "./common/layout";
import { CellState, initialBoard } from "./game-board";
import { GamePlaying, GameStatus, Move } from "./generated/graphql";

interface Props {
  status: GameStatus;
}

export const GameView: React.FC<Props> = ({ status }) => {
  const [state, setState] = useState(status);

  return (
    <BoardLayout>
      {initialBoard(state.me).map(cellState => (
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

const keyFromCell = ({ move: { position, token } }: CellState) => `${position}-${token}`;

// take the moves and fill them with an empty array
// maybe write some tests...?
const isMyTurn = (game: GamePlaying) => game.me === game.next;
