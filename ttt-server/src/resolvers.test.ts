import { create as createStore, UserModel } from "./store";
import { login, TTTDataSources } from "./environment";
import { User, Game, Move } from "./generated/models";
import { joinGame } from "./resolvers";
import { GameAPI, coreMoveFromMove } from "./data-sources/game-api-data-source";
import { createGame, Game as CoreGame } from "@grancalavera/ttt-core";
import { GameDescriptionDataSource } from "./data-sources/game-description-data-source";
import { GAME_LOBBY } from "./model";

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

describe("Alice, Bob and Jane are the first users to ever join a game.", () => {
  const storage = "./join-game.sqlite";

  let alice: User;
  let bob: User;
  let jane: User;

  const mockGameAPI: GameAPI = new MockGameAPIDataSource();

  const mockDataSources = {
    gameAPIDataSource: mockGameAPI,
    gameDescriptionDataSource: new GameDescriptionDataSource()
  } as TTTDataSources;

  beforeAll(async () => {
    await createStore({ storage }).sync();

    [alice, bob, jane] = await Promise.all([
      UserModel.findOrCreate({
        where: { email: "alice@email.com" }
      }),
      UserModel.findOrCreate({
        where: { email: "bob@email.com" }
      }),
      UserModel.findOrCreate({
        where: { email: "jane@email.com" }
      })
    ]).then(users => users.map(([model]) => login(model).user));
  });

  describe("Alice joins the first game ever, then:", () => {
    let game: Game;
    beforeAll(async () => {
      game = await joinGame(alice, mockDataSources);
    });

    it("the game's state should be 'GameLobby'", () => {
      expect(game.state.__typename).toBe(GAME_LOBBY);
    });

    it("Alice should be the player 'waiting' at the lobby", () => {
      if (game.state.__typename === "GameLobby") {
        expect(game.state.waiting.user).toBe(alice);
      } else {
        throw new Error("Unexpected game state");
      }
    });
  });

  xdescribe("Alice joins another game, then:", () => {
    it.todo("the game's state should be 'GameLobby'");
    it.todo("Alice should be the player 'waiting' at the lobby");
  });

  xdescribe("Bob joins a game", () => {
    it.todo("the game status should be 'GamePlaying'");
    it.todo("Alice and Bob should be the players in the game");
    it.todo("Alice OR Bob should be current player in the game");
  });

  xdescribe("Jane joins to join a game", () => {
    it.todo("the game status should be 'GamePlaying'");
    it.todo("Alice and Bob should be the players in the game");
    it.todo("Alice OR Bob should be current player in the game");
  });
});
