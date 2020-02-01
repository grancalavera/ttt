import { Button, Intent } from "@blueprintjs/core";
import React from "react";
import { BoardLayout, CellLayout } from "./common/layout";
import { CellState, updateBoard } from "./game-board";
import { GameStatus, Move } from "./generated/graphql";
import { assertNever } from "@grancalavera/ttt-core";

interface Props {
  gameState: GameStatus;
}

export const GameView: React.FC<Props> = ({ gameState }) => {
  return (
    <BoardLayout>
      {updateBoard(gameState).map((cellState, i) => (
        // we know cell are always sorted by position
        // and position is isomorphic to iteration index,
        // so is fine to use `i` as `key`, leave us alone!
        <Cell key={i} cellState={cellState} />
      ))}
    </BoardLayout>
  );
};

const Cell: React.FC<{ cellState: CellState }> = ({ cellState }) => {
  const CellBody = () => {
    switch (cellState.kind) {
      case "free":
        return <FreeCell move={cellState.move} onPlay={() => {}} />;
      case "played":
        return <PlayedCell move={cellState.move} />;
      case "disabled":
        return <DisabledCell />;
      default:
        return assertNever(cellState);
    }
  };

  return (
    <CellLayout>
      <CellBody />
    </CellLayout>
  );
};

const FreeCell: React.FC<{
  move: Move;
  onPlay: (move: Move) => void;
}> = ({ move, onPlay }) => {
  const handleOnClick = () => onPlay(move);
  return <Button minimal intent={Intent.PRIMARY} onClick={handleOnClick} />;
};

const PlayedCell: React.FC<{ move: Move }> = ({ move }) => <>Played</>;

const DisabledCell: React.FC = () => <Button minimal disabled intent={Intent.PRIMARY} />;
