import { groupBy, map, pipe, values } from "ramda";
import { GameResponse } from "../model";
import { MoveModel } from "../store";
import {
  currentPlayerFromMoves,
  isGameOver,
  moveModelsToMoves,
  winnerFromMoves,
  movesToCoreMoves
} from "./common";

export const findAllGames = async (): Promise<GameResponse[]> => {
  const moves = await MoveModel.findAll();
  return allGamesFromMoves(moves);
};

export const findGameById = async (gameId: string): Promise<GameResponse | null> => {
  const moves = await MoveModel.findAll({ where: { gameId } });
  return moves.length ? gameFromMoves(moves) : null;
};

export const gameFromMoves = (moveModels: MoveModel[]): GameResponse => {
  const moves = moveModelsToMoves(moveModels);
  return {
    id: moves[0].gameId,
    currentPlayer: currentPlayerFromMoves(moves),
    isGameOver: isGameOver(moves),
    winner: winnerFromMoves(moves),
    moves: movesToCoreMoves(moves)
  };
};

const allGamesFromMoves = pipe(
  groupBy(({ gameId }: MoveModel) => gameId),
  values,
  map(gameFromMoves)
);
