import { TTTContext } from "../environment";
import { Avatar, PlayMoveResult, Position } from "../generated/models";

export const playMove = async (
  gameId: string,
  avatar: Avatar,
  position: Position,
  context: TTTContext
): Promise<PlayMoveResult> => {
  throw new Error("playMove not implemented");
};
