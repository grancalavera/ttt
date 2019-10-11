import { groupBy, map, pipe, values } from "ramda";
import {
  currentPlayerFromMoves,
  isGameOverFromMoves,
  winnerFromMoves,
  coreMovesFromMoves
} from "./common";
import { GameResponse } from "../model";
import { MoveModel } from "../store";

export const findAllGames = async (): Promise<GameResponse[]> => {
  const moves = await MoveModel.findAll();
  return allGamesFromMoves(moves);
};

export const findGameById = async (gameId: string): Promise<GameResponse | null> => {
  const moves = await MoveModel.findAll({ where: { gameId } });
  return moves.length ? gameFromMoves(moves) : null;
};

const gameFromMoves = (moves: MoveModel[]): GameResponse => ({
  id: moves[0].gameId,
  currentPlayer: currentPlayerFromMoves(moves),
  isGameOver: isGameOverFromMoves(moves),
  winner: winnerFromMoves(moves),
  moves: coreMovesFromMoves(moves)
});

const allGamesFromMoves = pipe(
  groupBy(({ gameId }: MoveModel) => gameId),
  values,
  map(gameFromMoves)
);
