import { AcceptChallenge, CreateGameValidationError, Game, CreateGameInput } from "model";
import { failure, getFailure, getSuccess, isFailure, success } from "result";
import { isInvalid, InvalidInput } from "validation";
import { sequence } from "validation/sequence";
import { createPlayers } from "./create-players";
import { createPositions } from "./create-positions";

export const acceptChallenge: AcceptChallenge = (dependencies) => (input) => async () => {
  const { findChallenge, findOpponent, getUniqueId } = dependencies;
  const { challengeId, opponentId, opponentPosition } = input;

  const runFindChallenge = findChallenge(challengeId);
  const runFindOpponent = findOpponent(opponentId);

  // With the current behaviour we try to resolve dependencies in sequence: earlier
  // failures will prevent subsequent dependencies from being resolved. Another approach
  // would be to resolve dependencies concurrently and bail eagerly as soon as the first
  // dependency fails, so that we don't leave any client hanging for too long. The
  // downside of this is potentially clients would have to do several roundtrips in order
  // to discover all dependency errors. Another option would be to resolve the
  // dependencies concurrently and wait for all of them to complete, collect errors and
  // send lists of failures, as we do with validations.

  const findChallengeResult = await runFindChallenge();
  if (isFailure(findChallengeResult)) {
    return findChallengeResult;
  }

  const findOpponentResult = await runFindOpponent();
  if (isFailure(findOpponentResult)) {
    return findOpponentResult;
  }

  const challenge = getSuccess(findChallengeResult);
  const opponent = getSuccess(findOpponentResult);
  const createGameInput = { challenge, opponent, opponentPosition };

  const validationResults = sequence([
    createPlayers(createGameInput),
    createPositions(createGameInput),
  ]);

  if (isInvalid(validationResults)) {
    return failWithGameValidationError(getFailure(validationResults));
  }

  const [players, positions] = getSuccess(validationResults);

  const game: Game = {
    gameId: getUniqueId(),
    size: 3,
    players,
    moves: [
      [players[0], positions[0]],
      [players[1], positions[1]],
    ],
  };

  return success(game);
};

export const failWithGameValidationError = (
  validationResults: InvalidInput<CreateGameInput>[]
) => failure(new CreateGameValidationError(validationResults));
