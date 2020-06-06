import { AcceptChallenge, CreateGame, CreateGameValidationError } from "model";
import { isFailure, getSuccess, failure } from "result";
import { isInvalid } from "validation";

export const acceptChallenge: AcceptChallenge = (dependencies) => (input) => async () => {
  const { findChallenge, findOpponent, getUniqueId } = dependencies;
  const { challengeId, opponentId, position } = input;

  const runFindChallenge = findChallenge(challengeId);
  const runFindOpponent = findOpponent(opponentId);

  const findChallengeResult = await runFindChallenge();
  if (isFailure(findChallengeResult)) {
    return findChallengeResult;
  }

  const findOpponentResult = await runFindOpponent();
  if (isFailure(findOpponentResult)) {
    return findOpponentResult;
  }

  const createGameResult = createGame({
    gameId: getUniqueId(),
    challenge: getSuccess(findChallengeResult),
    opponent: getSuccess(findOpponentResult),
    position,
  });

  if (isInvalid(createGameResult)) {
    return failure(new CreateGameValidationError(createGameResult.error));
  }

  return createGameResult;
};

const createGame: CreateGame = (input) => {
  throw new Error("create game not implemented");
};
