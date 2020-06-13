import { Challenge, CreateChallenge } from "model";
import { success, isFailure } from "result";

export const createChallenge: CreateChallenge = (dependencies) => (input) => async () => {
  const { getUniqueId, saveChallenge } = dependencies;
  const { challenger, challengerPosition } = input;

  const challenge: Challenge = {
    challengeId: getUniqueId(),
    challenger,
    challengerPosition,
  };

  const runSaveChallenge = saveChallenge(challenge);
  const saveResult = await runSaveChallenge();
  if (isFailure(saveResult)) {
    return saveResult;
  }

  return success(challenge);
};
