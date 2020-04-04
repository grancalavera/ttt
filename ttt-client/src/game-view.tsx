import { Button, Intent } from "@blueprintjs/core";
import { assertNever } from "@grancalavera/ttt-core";
import React from "react";
import { BoardLayout, CellLayout } from "./common/layout";
import { amIWaiting, CellState, updateBoard } from "./game-board";
import { GameState, Move } from "./generated/graphql";
import { useLoader } from "./hooks/use-loader";

interface Props {
  gameState: GameState;
}

export const GameView: React.FC<Props> = ({ gameState }) => {
  const { toggleLoader } = useLoader();
  toggleLoader(amIWaiting(gameState));

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
        return null;
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
