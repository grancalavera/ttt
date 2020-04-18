import { Move, Player } from "../model";
import { uniqBy } from "lodash/fp";

export const validMoves = (ms: Move[]): boolean => {
  return validContinuity(ms) && validUniqueness(ms) && validSingleWinner(ms);
};

const validContinuity = (ms: Move[]): boolean => {
  type Previous = Player | undefined;
  type Valid = boolean;
  type Step = [Previous, Valid];
  const seed: Step = [undefined, true];

  const [_, valid] = ms.reduce((lastStep, move) => {
    const [lastPlayer, lastValid] = lastStep;
    const [thisPlayer] = move;
    const thisValid = lastPlayer !== thisPlayer;
    const nextStep: Step = [thisPlayer, lastValid && thisValid];
    return nextStep;
  }, seed);

  return valid;
};

const validUniqueness = (ms: Move[]): boolean => {
  const unique = uniqBy<Move>(([_, position]) => position, ms);
  return unique.length === ms.length;
};

const validSingleWinner = (ms: Move[]): boolean => {
  const candidates = lengths(ms).filter(candidate => candidate.length > 4);
  // now show there is only 1 winner
  // for example:
  // filter candidates by winner
  // then count the winners
  // assert winners = 1
  return true;
};

const lengths = <T>(xs: T[]): T[][] => {
  const seed: T[][] = [[]];
  return xs
    .reduce((acc, x) => {
      const [last] = acc;
      return [[...last, x], ...acc];
    }, seed)
    .reverse();
};
