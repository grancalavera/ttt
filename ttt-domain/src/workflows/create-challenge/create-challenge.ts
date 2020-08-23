import { Challenge } from "../../domain/model";
import { isFailure, success } from "@grancalavera/ttt-etc";
import { CreateChallenge } from "./workflow";

export const createChallenge: CreateChallenge = (dependencies) => (input) => async () => {
  const { getUniqueId: getUniqueId, createChallenge } = dependencies;
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
