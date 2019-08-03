// https://jestjs.io/docs/en/es6-class-mocks

import { createGame, Game as CoreGame } from "@grancalavera/ttt-core";
import { Move } from "../../generated/models";
import { coreMoveFromMove } from "../../common";
import { GameAPI } from "../game-api-data-source";

class MockGameAPIDataSource implements GameAPI {
  private games: { [id: string]: CoreGame } = {};

  private _gameById(id: string): CoreGame | undefined {
    return this.games[id];
  }

  private _sendGameNotFound(id: string) {
    return Promise.reject(`game ${id} does not exist`);
  }

  private _sendGameResponse(id: string, game?: CoreGame) {
    return game ? Promise.resolve({ id, game }) : this._sendGameNotFound(id);
  }

  getGames() {
    const games = Object.keys(this.games).map(id => ({ id, game: this.games[id] }));
    return Promise.resolve(games);
  }

  getGameById(id: string) {
    return this._sendGameResponse(id, this._gameById(id));
  }

  getMovesByGameId(id: string) {
    const game = this._gameById(id);
    return game ? Promise.resolve({ id, moves: game.moves }) : this._sendGameNotFound(id);
  }

  postGame(id: string) {
    const game = createGame();
    this.games[id] = game;
    return this._sendGameResponse(id, game);
  }

  postMove(id: string, move: Move) {
    const game = this._gameById(id);
    if (game) {
      game.moves = [coreMoveFromMove(move), ...game.moves];
      return this._sendGameResponse(id, game);
    } else {
      return this._sendGameNotFound(id);
    }
  }
}

export const GameAPIDataSource: jest.Mock<GameAPI, []> = jest.fn(
  () => new MockGameAPIDataSource()
);
