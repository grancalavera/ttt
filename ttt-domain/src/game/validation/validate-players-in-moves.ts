import { invalidGameInput, ValidateGame } from "game/validation/types";
import { filter, flow, map, uniq } from "lodash/fp";
import { Move, Player } from "model";
import { valid } from "validation";

export const validatePlayersInMoves: ValidateGame = (g) =>
  flow([
    map(([p]: Move) => p),
    filter((p: Player) => !g.players.includes(p)),
    uniq,
    (ps: Player[]) => ps.length == 0,
    (isValid: boolean) => (isValid ? valid(g) : invalidPlayersInMoves(g)),
  ])(g.moves);

export const invalidPlayersInMoves = invalidGameInput(
  "Some players in moves do not belong to this game"
);
