import { filter, flow, map, uniq } from "lodash/fp";
import { Game, Move, Player } from "model";
import * as result from "validation-result";
import { Invalid, InvalidGame, ValidationResult } from "validation-result";
import { validateMoves } from "validation/validate-moves";
import { validPlayers } from "validation/validate-players";

export const validateGame = (g: Game): ValidationResult<Invalid> => {
  const { players, moves, size } = g;
  return result.combine<Invalid>([
    validPlayers(players),
    validateMoves(size, moves),
    validatePlayersInMoves(g),
  ]);
};

const validatePlayersInMoves = (g: Game): ValidationResult<InvalidGame> =>
  flow([
    map(([p]: Move) => p),
    filter((p: Player) => !g.players.includes(p)),
    uniq,
    (ps: Player[]) => ps.length == 0,
    (valid: boolean) => (valid ? result.valid() : result.invalidPlayersInMoves(g)),
  ])(g.moves);
