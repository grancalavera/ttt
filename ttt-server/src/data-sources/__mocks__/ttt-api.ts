// https://jestjs.io/docs/en/es6-class-mocks

import { Move, movesToGameResponse } from "@grancalavera/ttt-api";
import { ITTTAPIDataSource } from "data-sources/ttt-api";

class MockGameAPI implements ITTTAPIDataSource {
  private moves: { [gameId: string]: Move[] } = {};

  private _getGameById(gameId: string) {
    const moves = this.moves[gameId];
    return movesToGameResponse(moves);
  }

  getAllGames() {
    const gameResponses = Object.keys(this.moves).map(
      this._getGameById.bind(this)
    );
    return Promise.resolve(gameResponses);
  }

  getGameById(gameId: string) {
    return Promise.resolve(this._getGameById(gameId));
  }

  postMove(move: Move) {
    const { gameId } = move;
    this.moves[gameId].push(move);
    return Promise.resolve(this._getGameById(gameId));
  }
}

export const GameAPI: jest.Mock<ITTTAPIDataSource, []> = jest.fn(
  () => new MockGameAPI()
);
