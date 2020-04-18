import { uniqBy } from "lodash/fp";
import { Move, Player } from "model";
import { validRange } from "validation/valid-move";
import { winners } from "game/winners";

export const validMoves = (size: number, ms: Move[]): boolean => {
  return (
    validContinuity(ms) &&
    validUniqueness(ms) &&
    validSingleWinner(size, ms) &&
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

  return valid;
};

const validUniqueness = (ms: Move[]): boolean => {
  const valid = uniqByPosition(ms).length === ms.length;
  return valid;
};

const validSingleWinner = (size: number, ms: Move[]): boolean => {
  const ws = winners(size, ms);
  const valid = ws.length < 2;
  return valid;
};

const validRanges = (size: number, ms: Move[]): boolean => {
  const valid = ms.every(validRange(size));
  return valid;
};

const validPlayerCount = (ms: Move[]): boolean => {
  const valid = uniqByPlayer(ms).length <= 2;
  return valid;
};

const uniqByPosition = uniqBy<Move>(([_, position]) => position);
const uniqByPlayer = uniqBy<Move>(([player]) => player);
