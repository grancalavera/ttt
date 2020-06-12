import { CreateMoveInput, CreateMoveValidationError, PlayMove } from "model";
import { failure, getFailure, isFailure } from "result";
import { InvalidInput, isInvalid } from "validation";
import { sequence } from "validation/sequence";
import { validateGameStatus } from "./validate-game-status";
import { validateIsPlayersTurn } from "./validate-is-players-turn";
import { validatePlayerExistsInGame } from "./validate-player-exists-in-game";
import { validatePositionInsideBoard } from "./validate-position-inside-board";
import { validatePositionNotPlayed } from "./validate-position-not-played";

export const playMove: PlayMove = (dependencies) => ({
  gameId,
  playerId,
  playerPosition,
}) => async () => {
  const { findGame, findPlayer } = dependencies;

  const runFindGame = findGame(gameId);
  const runFindPlayer = findPlayer(playerId);

  const findGameResult = await runFindGame();
  if (isFailure(findGameResult)) {
    return findGameResult;
  }

  const findPlayerResult = await runFindPlayer();
  if (isFailure(findPlayerResult)) {
    return findPlayerResult;
  }

  const game = findGameResult.value;
  const player = findPlayerResult.value;
  const input: CreateMoveInput = { game, player, playerPosition };

  const guard = sequence([
    validateGameStatus(input),
    validatePlayerExistsInGame(input),
    validateIsPlayersTurn(input),
    validatePositionNotPlayed(input),
    validatePositionInsideBoard(input),
  ]);

  if (isInvalid(guard)) {
    return failWithMoveValidationError(getFailure(guard));
  }

  throw new Error("playMove not fully implemented");
};

export const failWithMoveValidationError = (
  validationResults: InvalidInput<CreateMoveInput>[]
) => failure(new CreateMoveValidationError(validationResults));
