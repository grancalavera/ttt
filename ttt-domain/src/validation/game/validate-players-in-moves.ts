import { filter, flow, map, uniq } from "lodash/fp";
import { Game, Move, Player } from "model";
import * as v from "validation-result/validation";
import { GameValidation, invalidGame } from "validation/types";

export const validatePlayersInMoves = (g: Game): GameValidation =>
  flow([
    map(([p]: Move) => p),
    filter((p: Player) => !g.players.includes(p)),
    uniq,
    (ps: Player[]) => ps.length == 0,
    (valid: boolean) => (valid ? v.valid(g) : invalidPlayersInMoves(g)),
  ])(g.moves);

export const invalidPlayersInMoves = invalidGame(
  "Some players in moves do not belong to this game"
);
