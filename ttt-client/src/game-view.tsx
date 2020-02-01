import { Button, Intent } from "@blueprintjs/core";
import React from "react";
import { BoardLayout, CellLayout } from "./common/layout";
import { CellState, updateBoard } from "./game-board";
import { GameStatus, Move } from "./generated/graphql";

interface Props {
  status: GameStatus;
}

export const GameView: React.FC<Props> = ({ status }) => {
  return (
    <BoardLayout>
      {updateBoard(status).map((cellState, i) => (
        // we know cell are always sorted by position
        // and position is isomorphic to iteration index,
        // so is fine to use `i` as `key`, leave us alone!
        <Cell key={i} cellState={cellState} />
      ))}
    </BoardLayout>
  );
};

const Cell: React.FC<{ cellState: CellState }> = ({ cellState }) => <>nothing</>;
// cellState.isFree ? (
//   <PlayButton onPlay={m => console.log(m)} move={cellState.move} />
// ) : (
//   <PlayedCell move={cellState.move} />
// );

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

const PlayedCell: React.FC<{ move: Move }> = ({ move }) => (
  <CellLayout>Played</CellLayout>
);

const EmptyCell: React.FC = () => <CellLayout>Empty</CellLayout>;
