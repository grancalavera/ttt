import {
  AcceptChallenge,
  CreateGameInput,
  CreateGameValidationError,
  Game,
  challengerToPlayer,
  opponentToPlayer,
  Players,
  Position,
} from "model";
import { failure, getSuccess, isFailure, success } from "result";
import {
  isInvalid,
  ValidateInput,
  invalidInput,
  validInput,
  valid,
  Validation,
  InvalidInput,
} from "validation";
import { sequence } from "validation/sequence";

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

const createGame = (
  input: CreateGameInput
): Validation<Game, InvalidInput<CreateGameInput>[]> => {
  const validations = sequence([validatePlayers(input), validatePositions(input)]);

  if (isInvalid(validations)) {
    return validations;
  }

  const { gameId } = input;
  const [players, positions] = validations.value;
  const [ply1, ply2] = players;
  const [pos1, pos2] = positions;

  const game: Game = {
    gameId,
    moves: [
      [ply1, pos1],
      [ply2, pos2],
    ],
    players,
    size: 3,
  };

  return success(game);
};

const validatePlayers = (
  input: CreateGameInput
): Validation<Players, InvalidInput<CreateGameInput>> => {
  const {
    challenge: { challenger },
    opponent,
  } = input;

  if (challenger.challengerId === opponent.opponentId) {
    return invalidPlayers(input);
  }

  return valid([challengerToPlayer(challenger), opponentToPlayer(opponent)]);
};

const validatePositions = (
  input: CreateGameInput
): Validation<[Position, Position], InvalidInput<CreateGameInput>> => {
  const { challenge, position } = input;

  if (challenge.position === position) {
    return invalidPositions(input);
  }

  return valid([challenge.position, position]);
};

const invalidPlayers = invalidInput("Games cannot contain duplicated players");
const invalidPositions = invalidInput(
  "A challenge can not be accepted using a position already played in the challenge"
);
