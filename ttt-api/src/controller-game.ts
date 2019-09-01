import { groupBy, map, pipe, values } from "ramda";
import {
  currentPlayerFromMoves,
  isGameOverFromMoves,
  winnerFromMoves,
  coreMovesFromMoves
} from "./controller-common";
import { ResponseGame } from "./model";
import { StandaloneMoveModel as MoveModel } from "./store";

export const findAllGames = async (): Promise<ResponseGame[]> => {
  const moves = await MoveModel.findAll();
  return allGamesFromMoves(moves);
};

export const findGameById = async (gameId: string): Promise<ResponseGame | null> => {
  const moves = await MoveModel.findAll({ where: { gameId } });
  return moves.length ? gameFromMoves(moves) : null;
};

const gameFromMoves = (moves: MoveModel[]): ResponseGame => ({
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
