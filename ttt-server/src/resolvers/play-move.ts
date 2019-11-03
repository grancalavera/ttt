import { TTTContext } from "../environment";
import { PlayMoveResult, Position, Token } from "../generated/models";

export const playMove = async (
  gameId: string,
  token: Token,
  position: Position,
  context: TTTContext
): Promise<PlayMoveResult> => {
  throw new Error("playMove not implemented");
};
