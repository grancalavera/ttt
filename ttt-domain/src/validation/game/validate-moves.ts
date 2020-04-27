import { winners } from "game/winners";
import { uniqBy } from "lodash/fp";
import { Game, Move, Player } from "model";
import * as v from "validation-result/validation";
import { isMoveInsideRange } from "validation/common";
import { GameValidation, invalidGame, ValidateGame, validations } from "validation/types";

export const invalidContinuity = invalidGame("Some players played consecutive moves");
export const invalidUniqueness = invalidGame(
  "Some positions have been played more than once"
);
export const invalidRanges = invalidGame("Some moves are out of range");
export const invalidPlayerCount = invalidGame("There are more than two (2) players");
export const invalidSingleWinner = invalidGame("There is more than one (1) winner");

const validateContinuity = (g: Game): GameValidation => {
  type Previous = Player | undefined;
  type Valid = boolean;
  type Step = [Previous, Valid];
  const seed: Step = [undefined, true];

  const [_, valid] = g.moves.reduce((lastStep, move) => {
    const [lastPlayer, lastValid] = lastStep;
    const [thisPlayer] = move;
    const thisValid = lastPlayer !== thisPlayer;
    const nextStep: Step = [thisPlayer, lastValid && thisValid];
    return nextStep;
  }, seed);

  return valid ? v.valid(g) : invalidContinuity(g);
};

const validateUniqueness: ValidateGame = (g) => {
  const { moves } = g;
  const valid = uniqByPosition(moves).length === moves.length;
  return valid ? v.valid(g) : invalidUniqueness(g);
};

const validateRanges: ValidateGame = (g) => {
  const valid = g.moves.every(isMoveInsideRange(g.size));
  return valid ? v.valid(g) : invalidRanges(g);
};

const validatePlayerCount: ValidateGame = (g) => {
  const valid = uniqByPlayer(g.moves).length <= 2;
  return valid ? v.valid(g) : invalidPlayerCount(g);
};

const validateSingleWinner: ValidateGame = (g) => {
  const ws = winners(g.size, g.moves);
  const valid = ws.length < 2;
  return valid ? v.valid(g) : invalidSingleWinner(g);
};

const uniqByPosition = uniqBy<Move>(([_, position]) => position);
const uniqByPlayer = uniqBy<Move>(([player]) => player);

export const validateMoves = validations([
  validateContinuity,
  validateUniqueness,
  validateRanges,
  validatePlayerCount,
  validateSingleWinner,
]);
