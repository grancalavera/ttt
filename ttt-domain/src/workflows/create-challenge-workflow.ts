import { CreateChallenge, ChallengerNotFoundError } from "model";
import { failure, isSuccess, success } from "result";

export const openChallenge: CreateChallenge = (dependencies) => (input) => async () => {
  const { findChallenger, getUniqueId } = dependencies;
  const { challengerId, position } = input;

  const runFindChallenger = findChallenger(challengerId);
  const challengerResult = await runFindChallenger();

  if (isSuccess(challengerResult)) {
    return success({
      challengeId: getUniqueId(),
      challenger: challengerResult.value,
      position,
    });
  } else {
    return failure(new ChallengerNotFoundError(challengerId));
  }
};
