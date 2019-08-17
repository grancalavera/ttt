// https://jestjs.io/docs/en/es6-class-mocks

import { createGame, CoreGame, CoreMove } from "@grancalavera/ttt-core";
import { Move } from "../../generated/models";
import { coreMoveFromMove } from "../../common";
import { IGameAPI } from "../game-api";

class MockGameAPI implements IGameAPI {
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

  getAllGames() {
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

  postMove(id: string, move: CoreMove) {
    const game = this._gameById(id);
    if (game) {
      game.moves = [move, ...game.moves];
      return this._sendGameResponse(id, game);
    } else {
      return this._sendGameNotFound(id);
    }
  }
}

export const GameAPI: jest.Mock<IGameAPI, []> = jest.fn(() => new MockGameAPI());