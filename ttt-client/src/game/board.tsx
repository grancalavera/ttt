import { Button, Intent } from "@blueprintjs/core";
import { assertNever } from "@grancalavera/ttt-core";
import React from "react";
import { BoardLayout, CellLayout } from "../common/layout";
import { WithTypename } from "../common/with-typename";
import { GameState, Move } from "../generated/graphql";
import { useLoading } from "../loader/use-loading";
import { amIWaiting } from "./turn";
import { CellState } from "./types";
import { updateBoard } from "./update-board";

interface BoardProps {
  gameState: WithTypename<GameState>;
}

export const Board: React.FC<BoardProps> = ({ gameState }) => {
  const { toggleLoading: toggleLoader } = useLoading();
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
        return <FreeCell move={cellState.move} />;
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
}> = ({ move }) => {
  const handleOnClick = () => {};
  return <Button minimal intent={Intent.PRIMARY} onClick={handleOnClick} />;
};

const PlayedCell: React.FC<{ move: Move }> = ({ move }) => <>Played</>;
