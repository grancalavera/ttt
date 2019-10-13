import { GameResponse } from "@grancalavera/ttt-api";
import { CorePlayer } from "@grancalavera/ttt-core";
import {
  coreMoveToMove,
  corePlayerToPlayer,
  findWinningMove,
  resolveWaitingPlayer
} from "../common";
import { Game, GameOverTie, GameOverWin, GamePlaying } from "../generated/models";
import { GameTypename, playerFromModel } from "../model";
import { GameModel } from "../store";

export const combineGames = (storeGame: GameModel, gameResponse?: GameResponse): Game => {
  if (storeGame.isInLobby) {
    return gameInLobby(storeGame);
  }

  if (gameResponse && gameResponse.isGameOver && gameResponse.winner) {
    return gameOverWin(gameResponse, storeGame, gameResponse.winner);
  } else if (gameResponse && gameResponse.isGameOver) {
    return gameOverTie(gameResponse, storeGame);
  } else if (gameResponse) {
    return gamePlaying(gameResponse, storeGame);
  } else {
    throw new Error("Missing API game for a store game that should be playing");
  }
};

export const gameInLobby = (storeGame: GameModel) => ({
  id: storeGame.id,
  __typename: GameTypename.GameLobby,
  waiting: resolveWaitingPlayer(storeGame)
});

export const gamePlaying = (
  gameResponse: GameResponse,
  storeGame: GameModel
): GamePlaying => {
  if (gameResponse.currentPlayer) {
    return {
      __typename: GameTypename.GamePlaying,
      currentPlayer: corePlayerToPlayer(gameResponse.currentPlayer, storeGame),
      ...commonGame(gameResponse, storeGame)
    };
  } else {
    throw new Error("Invalid existing game: currentPlayer is missing");
  }
};

export const gameOverTie = (
  gameResponse: GameResponse,
  storeGame: GameModel
): GameOverTie => ({
  id: storeGame.id,
  __typename: GameTypename.GameOverTie,
  ...commonGame(gameResponse, storeGame)
});

export const gameOverWin = (
  gameResponse: GameResponse,
  storeGame: GameModel,
  winner: CorePlayer
): GameOverWin => ({
  __typename: GameTypename.GameOverWin,
  winner: corePlayerToPlayer(winner, storeGame),
  winningMove: findWinningMove(gameResponse)!,
  ...commonGame(gameResponse, storeGame)
});

const commonGame = (coreGame: GameResponse, storeGame: GameModel) => ({
  id: storeGame.id,
  moves: coreGame.moves.map(coreMoveToMove),
  oPlayer: playerFromModel(storeGame.playerO),
  xPlayer: playerFromModel(storeGame.playerX)
});
