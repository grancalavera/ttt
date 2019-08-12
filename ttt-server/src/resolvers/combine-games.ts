import { GameModel } from "../store";
import { GameTypename, playerFromModel } from "../model";
import {
  resolveWaitingPlayer,
  corePlayerToPlayer,
  coreMoveToMove,
  coreWinToWin,
  assertNever
} from "../common";
import {
  CoreGamePlaying,
  CoreGameOverTie,
  CoreGameOverWin,
  CORE_GAME_PLAYING,
  CORE_GAME_OVER_TIE,
  CORE_GAME_OVER_WIN,
  CoreGame
} from "@grancalavera/ttt-core";
import { GamePlaying, GameOverTie, GameOverWin, Game } from "../generated/models";

export const combineGames = (coreGame: CoreGame, storeGame: GameModel): Game => {
  if (storeGame.isInLobby) {
    return gameInLobby(storeGame);
  }

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

export const gameInLobby = (storeGame: GameModel) => ({
  id: storeGame.id,
  __typename: GameTypename.GameLobby,
  waiting: resolveWaitingPlayer(storeGame)
});

export const gamePlaying = (
  coreGame: CoreGamePlaying,
  storeGame: GameModel
): GamePlaying => ({
  __typename: GameTypename.GamePlaying,
  currentPlayer: corePlayerToPlayer(coreGame.currentPlayer, storeGame),
  ...commonGame(coreGame, storeGame)
});

export const gameOverTie = (
  coreGame: CoreGameOverTie,
  storeGame: GameModel
): GameOverTie => ({
  id: storeGame.id,
  __typename: GameTypename.GameOverTie,
  ...commonGame(coreGame, storeGame)
});

export const gameOverWin = (
  coreGame: CoreGameOverWin,
  storeGame: GameModel
): GameOverWin => ({
  __typename: GameTypename.GameOverWin,
  winner: corePlayerToPlayer(coreGame.winner, storeGame),
  winningMove: coreWinToWin(coreGame.winningMove),
  ...commonGame(coreGame, storeGame)
});

const commonGame = (coreGame: CoreGame, storeGame: GameModel) => ({
  id: storeGame.id,
  moves: coreGame.moves.map(coreMoveToMove),
  oPlayer: playerFromModel(storeGame.playerO),
  xPlayer: playerFromModel(storeGame.playerX)
});
