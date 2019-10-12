import { GameResponse } from "../model";
import { MoveModel } from "../store";
import {
  moveModelsToGameResponses,
  moveModelsToMoves,
  moveModelToMove,
  movesToGameResponse
} from "./common";

export const findAllGames = async (): Promise<GameResponse[]> => {
  const moveModels = await MoveModel.findAll();
  const moves = moveModelsToMoves(moveModels);
  return moveModelsToGameResponses(moves);
};

export const findGameById = async (gameId: string): Promise<GameResponse | null> => {
  const moveModels = await MoveModel.findAll({ where: { gameId } });
  return moveModels.length ? movesToGameResponse(moveModels.map(moveModelToMove)) : null;
};
