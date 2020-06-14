import { AcceptChallenge, CreateGameValidationError, Game, CreateGameInput } from "model";
import { failure, getFailure, getSuccess, isFailure, success } from "result";
import { isInvalid, InvalidInput } from "validation";
import { sequence } from "validation/sequence";
import { createPlayers } from "./create-players";
import { createPositions } from "./create-positions";

export const acceptChallenge: AcceptChallenge = (dependencies) => ({
  challengeId,
  opponent,
  opponentPosition,
}) => async () => {
  const { findChallenge, getUniqueId, createGame } = dependencies;

  const runFindChallenge = findChallenge(challengeId);

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

  const input = {
    challenge: getSuccess(findChallengeResult),
    opponent,
    opponentPosition,
  };

  const validationResults = sequence([createPlayers(input), createPositions(input)]);
  if (isInvalid(validationResults)) {
    return failWithGameValidationError(getFailure(validationResults));
  }

  const [players, positions] = getSuccess(validationResults);

  const game: Game = {
    gameId: getUniqueId(),
    status: { kind: "OpenGame", next: players[0] },
    size: 3,
    players,
    moves: [
      [players[0], positions[0]],
      [players[1], positions[1]],
    ],
  };

  const runCreateGame = createGame(game);
  const createGameResult = await runCreateGame();
  if (isFailure(createGameResult)) {
    return createGameResult;
  }

  return success(game);
};

export const failWithGameValidationError = (
  validationResults: InvalidInput<CreateGameInput>[]
) => failure(new CreateGameValidationError(validationResults));
