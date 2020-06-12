import {
  AcceptChallenge,
  CreateGameValidationError,
  Game,
  Challenger,
  Opponent,
} from "model";
import { failure, getFailure, getSuccess, isFailure, success } from "result";
import { isInvalid, Validation } from "validation";
import { sequence } from "validation/sequence";
import { createPlayers } from "./create-players";
import { createPositions } from "./create-positions";

export const acceptChallenge: AcceptChallenge = (dependencies) => (input) => async () => {
  const { findChallenge, findOpponent, getUniqueId } = dependencies;
  const { challengeId, opponentId, opponentPosition } = input;

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

  const challenge = getSuccess(findChallengeResult);
  const opponent = getSuccess(findOpponentResult);
  const createGameInput = { challenge, opponent, opponentPosition };

  const validationResults = sequence([
    createPlayers(createGameInput),
    createPositions(createGameInput),
  ]);

  if (isInvalid(validationResults)) {
    return failure(new CreateGameValidationError(getFailure(validationResults)));
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
