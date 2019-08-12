import { coreMoveFromMove } from "../common";
import { Context } from "../environment";
import { Avatar, PlayMoveResult, Position } from "../generated/models";
import { handleMoveError } from "./common";

export const playMove = async (
  gameId: string,
  avatar: Avatar,
  position: Position,
  context: Context
): Promise<PlayMoveResult> => {
  const { gameAPI, gameStore } = context.dataSources;
  try {
    const move = coreMoveFromMove({ avatar, position });
    const { game: coreGame } = await gameAPI.postMove(gameId, move);
    const storeGame = await gameStore.findGameById(gameId);
    return {} as PlayMoveResult;
  } catch (e) {
    return handleMoveError(e);
  }
};
