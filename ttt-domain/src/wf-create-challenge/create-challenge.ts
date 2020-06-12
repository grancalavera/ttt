import { CreateChallenge } from "model";
import { isFailure, success } from "result";

export const createChallenge: CreateChallenge = (dependencies) => (input) => async () => {
  const { findChallenger, getUniqueId } = dependencies;
  const { challengerId, challengerPosition } = input;

  const runFindChallenger = findChallenger(challengerId);

  const challengerResult = await runFindChallenger();
  if (isFailure(challengerResult)) {
    return challengerResult;
  }

  return success({
    challengeId: getUniqueId(),
    challenger: challengerResult.value,
    challengerPosition,
  });
};
