import { winners } from "game/winners";
import { uniqBy } from "lodash/fp";
import { Game, Move, Player } from "model";
import { invalidInput, validations, valid } from "validation";
import { GameValidation, ValidateGame } from "game/validation/types";

export const invalidContinuity: ValidateGame = invalidInput(
  "Some players played consecutive moves"
);
export const invalidUniqueness = invalidInput(
  "Some positions have been played more than once"
);
export const invalidRanges = invalidInput("Some moves are out of range");
export const invalidPlayerCount = invalidInput("There are more than two (2) players");
export const invalidSingleWinner = invalidInput("There is more than one (1) winner");

const validateContinuity = (g: Game): GameValidation => {
  type Previous = Player | undefined;
  type Valid = boolean;
  type Step = [Previous, Valid];
  const seed: Step = [undefined, true];

  const [_, isValid] = g.moves.reduce((lastStep, move) => {
    const [lastPlayer, lastValid] = lastStep;
    const [thisPlayer] = move;
    const thisValid = lastPlayer !== thisPlayer;
    const nextStep: Step = [thisPlayer, lastValid && thisValid];
    return nextStep;
  }, seed);

  return isValid ? valid(g) : invalidContinuity(g);
};

const validateUniqueness: ValidateGame = (g) => {
  const { moves } = g;
  const isValid = uniqByPosition(moves).length === moves.length;
  return isValid ? valid(g) : invalidUniqueness(g);
};

const validateRanges: ValidateGame = (g) => {
  const isValid = g.moves.every(isMoveInsideRange(g.size));
  return isValid ? valid(g) : invalidRanges(g);
};

const validatePlayerCount: ValidateGame = (g) => {
  const isValid = uniqByPlayer(g.moves).length <= 2;
  return isValid ? valid(g) : invalidPlayerCount(g);
};

const validateSingleWinner: ValidateGame = (g) => {
  const ws = winners(g.size, g.moves);
  const isValid = ws.length < 2;
  return isValid ? valid(g) : invalidSingleWinner(g);
};

const uniqByPosition = uniqBy<Move>(([_, position]) => position);
const uniqByPlayer = uniqBy<Move>(([player]) => player);
const isMoveInsideRange = (size: number) => ([_, p]: Move) => 0 <= p && p < size * size;

export const validateMoves = validations([
  validateContinuity,
  validateUniqueness,
  validateRanges,
  validatePlayerCount,
  validateSingleWinner,
]);
