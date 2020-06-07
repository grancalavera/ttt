import { PlayMove, CreateMove, CreateMoveValidationError } from "model";
import { isFailure, getSuccess, failure, success } from "result";
import { isInvalid } from "validation";
import { game } from "test";

export const playMove: PlayMove = (dependencies) => (input) => async () => {
  const { findGame, findPlayer } = dependencies;
  const { gameId, playerId, position } = input;

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

  const createMoveResult = createMove({
    game: getSuccess(findGameResult),
    player: getSuccess(findPlayerResult),
    position,
  });

  if (isInvalid(createMoveResult)) {
    return failure(new CreateMoveValidationError(createMoveResult.error));
  }

  const moves = [...game.moves, getSuccess(createMoveResult)];

  return success({ ...game, moves });
};

const createMove: CreateMove = (input) => {
  throw new Error("createMove note implemented");
};
