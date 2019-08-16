import { ErrorCode } from "@grancalavera/ttt-api";
import {
  CORE_GAME_OVER_TIE,
  CORE_GAME_OVER_WIN,
  CORE_GAME_PLAYING,
  CoreGame
} from "@grancalavera/ttt-core";

import { assertNever, coreMoveFromMove } from "../common";
import { TTTContext } from "../environment";
import {
  Avatar,
  PlayMoveResult,
  Position,
  ErrorGameOver,
  ErrorWrongMove,
  ErrorWrongTurn,
  GamePlaying,
  GameOverTie,
  GameOverWin
} from "../generated/models";
import { gameOverTie, gameOverWin, gamePlaying } from "./combine-games";
import { getErrorResponse } from "../common";
import { GameModel } from "../store";
import { pubsub, PUBSUB_GAME_CHANGED } from "../pubsub";

export const playMove = async (
  gameId: string,
  avatar: Avatar,
  position: Position,
  context: TTTContext
): Promise<PlayMoveResult> => {
  const { gameAPI, gameStore } = context.dataSources;
  try {
    const move = coreMoveFromMove({ avatar, position });
    const { game: coreGame } = await gameAPI.postMove(gameId, move);
    const storeGame = await gameStore.findGameById(gameId);
    const gameChanged = advanceGameStep(coreGame, storeGame);

    pubsub.publish(PUBSUB_GAME_CHANGED, { gameChanged });
    return gameChanged;
  } catch (e) {
    return handlePlayMoveError(e);
  }
};

const advanceGameStep = (
  coreGame: CoreGame,
  storeGame: GameModel
): GamePlaying | GameOverTie | GameOverWin => {
  switch (coreGame.kind) {
    case CORE_GAME_PLAYING:
      return gamePlaying(coreGame, storeGame);
    case CORE_GAME_OVER_TIE:
      return gameOverTie(coreGame, storeGame);
    case CORE_GAME_OVER_WIN:
      return gameOverWin(coreGame, storeGame);
    default:
      return assertNever(coreGame);
  }
};

const handlePlayMoveError = (e: any): ErrorGameOver | ErrorWrongMove | ErrorWrongTurn => {
  const { code, message } = getErrorResponse(e);
  switch (code) {
    case ErrorCode.GameOver:
      return {
        __typename: "ErrorGameOver",
        message
      };
    case ErrorCode.WrongMove:
      return {
        __typename: "ErrorWrongMove",
        message
      };
    case ErrorCode.WrongTurn:
      return {
        __typename: "ErrorWrongTurn",
        message
      };
    case ErrorCode.InvalidMove:
    case ErrorCode.NotFound:
      throw new Error(message);
    default:
      return assertNever(code);
  }
};
