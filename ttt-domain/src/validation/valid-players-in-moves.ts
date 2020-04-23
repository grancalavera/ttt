import { filter, flow, map, uniq } from "lodash/fp";
import { Game, Move, Player } from "model";
import * as result from "validation-result";
import { ValidationResult } from "validation-result";
import { InvalidGame } from "validation-result/types";

export const validPlayersInMoves = (g: Game): ValidationResult<InvalidGame> =>
  flow([
    map(([p]: Move) => p),
    filter((p: Player) => !g.players.includes(p)),
    uniq,
    (ps: Player[]) => ps.length == 0,
    (valid: boolean) => (valid ? result.valid() : result.invalidPlayersInMoves(g)),
  ])(g.moves);
