import { failure, getFailure, isFailure, success } from "../../result";
import { InvalidInput, isInvalid, sequence } from "../../validation";
import {
  CreateMoveInput,
  CreateMoveValidationError,
  GameUpdateFailedError,
  PlayMove,
} from "../play-move";
import { transitionGameState } from "./transition-game-state";
import { validateGameStatusIsOpen } from "./validate-game-status-is-open";
import { validateIsPlayersTurn } from "./validate-is-players-turn";
import { validatePlayerExistsInGame } from "./validate-player-exists-in-game";
import { validatePositionInsideBoard } from "./validate-position-inside-board";
import { validatePositionNotPlayed } from "./validate-position-not-played";

export const playMove: PlayMove = (dependencies) => ({
  gameId,
  player,
  playerPosition,
}) => async () => {
  const { findGame, updateGame } = dependencies;
  const runFindGame = findGame(gameId);

  const findGameResult = await runFindGame();
  if (isFailure(findGameResult)) {
    return findGameResult;
  }

  const game = findGameResult.value;
  const input: CreateMoveInput = { game, player, playerPosition };

  const guard = sequence([
    validateGameStatusIsOpen(input),
    validatePlayerExistsInGame(input),
    validateIsPlayersTurn(input),
    validatePositionNotPlayed(input),
    validatePositionInsideBoard(input),
  ]);

  if (isInvalid(guard)) {
    return failWithMoveValidationError(getFailure(guard));
  }

  const updatedGame = transitionGameState(game, [player, playerPosition]);

  const runUpdateGame = updateGame(updatedGame.gameId, updatedGame);
  const updateGameResult = await runUpdateGame();
  if (isFailure(updateGameResult)) {
    return failure(new GameUpdateFailedError(updatedGame));
  }

  return success(updatedGame);
};

export const failWithMoveValidationError = (
  validationResults: InvalidInput<CreateMoveInput>[]
) => failure(new CreateMoveValidationError(validationResults));
