import { Button, Intent } from "@blueprintjs/core";
import React from "react";
import { CellState } from "./cell-types";
import { GameState ,Move} from "@grancalavera/ttt-schema"
import { Cell, Screen } from "../layout/layout";
import { updateBoard } from "./update-board";
import { WithTypename } from "./with-typename";

interface BoardProps {
  gameState: WithTypename<GameState>;
}

export const Board: React.FC<BoardProps> = ({ gameState }) => {
  return (
    <Screen>
      {updateBoard(gameState).map((cellState, i) => (
        // we know cell are always sorted by position
        // and position is isomorphic to iteration index,
        // so is fine to use `i` as `key`, leave us alone!
        <Cell key={i}>{toCell(cellState)}</Cell>
      ))}
    </Screen>
  );
};

const FreeCell: React.FC<{
  move: Move;
}> = ({ move }) => {
  const handleOnClick = () => {};
  return <Button minimal intent={Intent.PRIMARY} onClick={handleOnClick} />;
};

const PlayedCell: React.FC<{ move: Move }> = ({ move }) => <>Played</>;

const toCell = (cellState: CellState) => {
  switch (cellState.kind) {
    case "free":
      return <FreeCell move={cellState.move} />;
    case "played":
      return <PlayedCell move={cellState.move} />;
    case "disabled":
      return null;
    default: {
      const never: never = cellState;
      throw new Error(`unknown cell state ${never}`);
    }
  }
};
