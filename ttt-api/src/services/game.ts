import { groupBy, map, pipe, values } from "ramda";
import { GameResponse } from "../model";
import { MoveModel } from "../store";
import { moveModelToMove, movesToGameResponse } from "./common";

const gameFromMoves = (moveModels: MoveModel[]): GameResponse =>
  movesToGameResponse(moveModels.map(moveModelToMove));

const allGamesFromMoves = pipe(
  groupBy(({ gameId }: MoveModel) => gameId),
  values,
  map(gameFromMoves)
);

export const findAllGames = async (): Promise<GameResponse[]> => {
  const moves = await MoveModel.findAll();
  return allGamesFromMoves(moves);
};

export const findGameById = async (gameId: string): Promise<GameResponse | null> => {
  const moves = await MoveModel.findAll({ where: { gameId } });
  return moves.length ? gameFromMoves(moves) : null;
};
