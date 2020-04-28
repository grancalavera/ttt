import { filter, flow, map, uniq } from "lodash/fp";
import { Game, Move, Player } from "model";
import { invalidInput, valid } from "validation";
import { GameValidation, ValidateGame } from "game/validation/types";

export const validatePlayersInMoves = (g: Game): GameValidation =>
  flow([
    map(([p]: Move) => p),
    filter((p: Player) => !g.players.includes(p)),
    uniq,
    (ps: Player[]) => ps.length == 0,
    (isValid: boolean) => (isValid ? valid(g) : invalidPlayersInMoves(g)),
  ])(g.moves);

export const invalidPlayersInMoves: ValidateGame = invalidInput(
  "Some players in moves do not belong to this game"
);
