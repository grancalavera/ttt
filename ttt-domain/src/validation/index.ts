import { Game, Move } from "../model";
import { validMoveCount } from "./valid-move-count";
import { validMoves } from "./valid-moves";
import { validOpenGame } from "./valid-open-game";
import { validPlayer } from "./valid-player";
import { validPlayers } from "./valid-players";
import { validPosition } from "./valid-position";

export const validGame = (g: Game): boolean => {
  const { moves, players } = g;
  return validPlayers(players) && validMoveCount(moves) && validMoves(moves);
};

export const validMove = (g: Game, m: Move): boolean => {
  const [player, position] = m;
  return validOpenGame(g) && validPlayer(g, player) && validPosition(g, position);
};
