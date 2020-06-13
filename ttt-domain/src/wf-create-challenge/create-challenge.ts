import { Challenge, CreateChallenge } from "model";
import { isFailure, success } from "result";

export const createChallenge: CreateChallenge = (dependencies) => (input) => async () => {
  const { getUniqueId, createChallenge } = dependencies;
  const { challenger, challengerPosition } = input;

  const challenge: Challenge = {
    challengeId: getUniqueId(),
    challenger,
    challengerPosition,
  };

  const runCreateChallenge = createChallenge(challenge);
  const saveResult = await runCreateChallenge();
  if (isFailure(saveResult)) {
    return saveResult;
  }

  return success(challenge);
};
