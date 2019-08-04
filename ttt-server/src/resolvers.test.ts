import { create as createStore, UserModel } from "./store";
import { login, TTTDataSources } from "./environment";
import { User, Game } from "./generated/models";
import { joinGame } from "./resolvers/join-game-mutation";
import { GameAPI } from "./data-sources/game-api";

import { GameStateKindMap } from "./model";
import { getAllGames } from "./resolvers/games-query";

jest.mock("./data-sources/game-api");

const mockDataSources = () =>
  ({
    gameAPI: new GameAPI("no-required")
  } as TTTDataSources);

describe("Alice, Bob and Jane are the first users to ever join a game.", () => {
  let alice: User;
  let bob: User;
  let jane: User;

  const dataSources = mockDataSources();

  beforeAll(async () => {
    const storage = `./join-game.sqlite`;
    await createStore({ storage }).sync({ force: true });
    [alice, bob, jane] = await UserModel.bulkCreate([
      { email: "alice@email.com" },
      { email: "bob@email.com" },
      { email: "jane@email.com" }
    ]).then(users => users.map(login).map(({ user }) => user));
  });

  describe("Alice joins the first game ever, then:", () => {
    let game: Game;

    beforeAll(async () => {
      game = await joinGame(alice, dataSources);
    });

    it("the game's state should be 'GameLobby'", () => {
      expect(game.state.__typename).toBe(GameStateKindMap.GameLobby);
    });

    it("Alice should be the player 'waiting' at the lobby", () => {
      if (game.state.__typename === GameStateKindMap.GameLobby) {
        expect(game.state.waiting.user).toBe(alice);
      } else {
        throw new Error("Unexpected game state");
      }
    });
  });

  describe("Alice joins another game, then:", () => {
    let game: Game;

    beforeAll(async () => {
      game = await joinGame(alice, dataSources);
    });

    it("the game's state should be 'GameLobby'", () => {
      expect(game.state.__typename).toBe(GameStateKindMap.GameLobby);
    });

    it("Alice should be the player 'waiting' at the lobby", () => {
      if (game.state.__typename === "GameLobby") {
        expect(game.state.waiting.user).toBe(alice);
      } else {
        throw new Error("Unexpected game state");
      }
    });

    it("There should be two games", async () => {
      const games = await getAllGames(dataSources);
      expect(games.length).toBe(2);
    });

    it("Alice should be waiting at the lobby of all games", async () => {
      const games = await getAllGames(dataSources);
      const actual = games.every(game => {
        if (game.state.__typename === GameStateKindMap.GameLobby) {
          return game.state.waiting.user.email === alice.email;
        } else {
          throw new Error("Unexpected game state");
        }
      });
      expect(actual).toBeTruthy();
    });
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
