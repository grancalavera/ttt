import { uniqBy } from "lodash/fp";
import { Move, Player } from "model";
import { validRange } from "validation/valid-move";

export const validMoves = (size: number, ms: Move[]): boolean => {
  return (
    validContinuity(ms) &&
    validUniqueness(ms) &&
    validSingleWinner(ms) &&
    validRanges(size, ms) &&
    validPlayerCount(ms)
  );
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

  if (!valid) {
    console.log("invalid continuity");
  }

  return valid;
};

const validUniqueness = (ms: Move[]): boolean => {
  const unique = uniqBy<Move>(([_, position]) => position, ms);
  const valid = unique.length === ms.length;
  if (!valid) {
    console.log("invalid uniqueness");
  }
  return valid;
};

const validSingleWinner = (ms: Move[]): boolean => {
  // now show there is only 1 winner
  // for example:
  // filter candidates by winner
  // then count the winners
  // assert winners = 1
  return true;
};

const validRanges = (size: number, ms: Move[]): boolean => {
  const valid = ms.every(validRange(size));
  console.log("invalid ranges");
  return valid;
};

const validPlayerCount = (ms: Move[]): boolean => {
  const unique = uniqBy<Move>(([player]) => player, ms);
  const valid = unique.length < 3;
  return valid;
};
