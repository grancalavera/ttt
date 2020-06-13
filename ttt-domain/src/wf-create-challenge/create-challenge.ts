import { CreateChallenge } from "model";
import { success } from "result";

export const createChallenge: CreateChallenge = (dependencies) => (input) => async () => {
  const { getUniqueId } = dependencies;
  const { challenger, challengerPosition } = input;

  return success({
    challengeId: getUniqueId(),
    challenger,
    challengerPosition,
  });
};
