import { Game } from "model";
import { validMoves } from "validation/valid-moves";
import { validPlayers, validPlayersInMoves } from "validation/valid-players";

export const validGame = (g: Game): boolean => {
  const { players, moves, size } = g;
  return validPlayers(players) && validMoves(size, moves) && validPlayersInMoves(g);
};
