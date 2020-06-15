import { Game, Move, OpenGame, Player, Players, Winner } from "../..";
import { failure, getFailure, isFailure, success } from "../../result";
import { InvalidInput, isInvalid, sequence } from "../../validation";
import {
  CreateMoveInput,
  CreateMoveValidationError,
  GameUpdateFailedError,
  PlayMove,
} from "../play-move";
import { validateGameStatusIsOpen } from "./validate-game-status-is-open";
import { validateIsPlayersTurn } from "./validate-is-players-turn";
import { validatePlayerExistsInGame } from "./validate-player-exists-in-game";
import { validatePositionInsideBoard } from "./validate-position-inside-board";
import { validatePositionNotPlayed } from "./validate-position-not-played";
import { findWinner } from "./winners";

export const playMove: PlayMove = (dependencies) => (input) => async () => {
  const { findGame, updateGame } = dependencies;
  const { gameId, player, playerPosition } = input;

  const runFindGame = findGame(gameId);
  const findGameResult = await runFindGame();
  if (isFailure(findGameResult)) {
    return findGameResult;
  }

  const game = findGameResult.value;

  const guard = validate({ game, player, playerPosition });
  if (isInvalid(guard)) {
    return failWithMoveValidationError(getFailure(guard));
  }

  const updatedGame = applyStateTransition({ game, player, playerPosition });
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

const validate = (input: CreateMoveInput) =>
  sequence([
    validateGameStatusIsOpen(input),
    validatePlayerExistsInGame(input),
    validateIsPlayersTurn(input),
    validatePositionNotPlayed(input),
    validatePositionInsideBoard(input),
  ]);

const applyStateTransition = (input: CreateMoveInput): Game => {
  const { game, player, playerPosition } = input;
  const move: Move = [player, playerPosition];

  if (game.status.kind === "DrawGame" || game.status.kind === "WonGame") {
    return game;
  }

  const moves = [...game.moves, move];
  const maybeWinner: Winner | undefined = findWinner(game.size, moves);

  if (maybeWinner) {
    return { ...game, moves, status: { kind: "WonGame", winner: maybeWinner } };
  }

  if (moves.length === game.size * game.size) {
    return { ...game, moves, status: { kind: "DrawGame" } };
  }

  return {
    ...game,
    moves,
    status: { kind: "OpenGame", next: getNextPlayer(game.status, game.players) },
  };
};

const getNextPlayer = ({ next: last }: OpenGame, [p1, p2]: Players): Player =>
  last === p1 ? p2 : p1;
