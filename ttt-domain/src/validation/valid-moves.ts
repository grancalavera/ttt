import { winners } from "game/winners";
import { uniqBy } from "lodash/fp";
import { Move, Player } from "model";
import * as result from "validation-result";
import { ValidationResult } from "validation-result";
import { InvalidMoves } from "validation-result/types";
import { validRange } from "validation/valid-move";

type ValidateMoves = (size: number, moves: Move[]) => ValidationResult<InvalidMoves>;

export const validMoves = (size: number, moves: Move[]): ValidationResult<InvalidMoves> =>
  result.combine(
    [
      validContinuity,
      validUniqueness,
      validRanges,
      validPlayerCount,
      validSingleWinner,
    ].map((v: ValidateMoves) => v(size, moves))
  );

const validContinuity = (size: number, moves: Move[]): ValidationResult<InvalidMoves> => {
  type Previous = Player | undefined;
  type Valid = boolean;
  type Step = [Previous, Valid];
  const seed: Step = [undefined, true];

  const [_, valid] = moves.reduce((lastStep, move) => {
    const [lastPlayer, lastValid] = lastStep;
    const [thisPlayer] = move;
    const thisValid = lastPlayer !== thisPlayer;
    const nextStep: Step = [thisPlayer, lastValid && thisValid];
    return nextStep;
  }, seed);

  return valid ? result.valid() : result.invalidContinuity(size, moves);
};

const validUniqueness = (size: number, moves: Move[]): ValidationResult<InvalidMoves> => {
  const valid = uniqByPosition(moves).length === moves.length;
  return valid ? result.valid() : result.invalidUniqueness(size, moves);
};

const validRanges = (size: number, moves: Move[]): ValidationResult<InvalidMoves> => {
  const valid = moves.every(validRange(size));
  return valid ? result.valid() : result.invalidRanges(size, moves);
};

const validPlayerCount = (
  size: number,
  moves: Move[]
): ValidationResult<InvalidMoves> => {
  const valid = uniqByPlayer(moves).length <= 2;
  return valid ? result.valid() : result.invalidPlayerCount(size, moves);
};

const validSingleWinner = (
  size: number,
  moves: Move[]
): ValidationResult<InvalidMoves> => {
  const ws = winners(size, moves);
  const valid = ws.length < 2;
  return valid ? result.valid() : result.invalidSingleWinner(size, moves);
};

const uniqByPosition = uniqBy<Move>(([_, position]) => position);
const uniqByPlayer = uniqBy<Move>(([player]) => player);
