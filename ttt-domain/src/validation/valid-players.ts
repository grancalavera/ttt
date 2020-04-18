import { Players, Game } from "../model";

export const validPlayers = (ps: Players): boolean => {
  const [p1, p2] = ps;
  return p1 !== p2;
};

export const validPlayersInMoves = (g: Game): boolean => {
  const valid = g.moves.every(([p]) => g.players.includes(p));
  return valid;
};
