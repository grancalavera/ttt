import { create as createStore, UserModel } from "../store";
import { TTTDataSources, TTTContext } from "../environment";
import { User, Game } from "../generated/models";
import { joinGame } from "./join-game";
import { GameAPI } from "../data-sources/game-api";

import { GameTypename, loginFromModel } from "../model";
import { GameStore } from "../data-sources/game-store";
import { getAllGames } from "./get-all-games";

jest.mock("../data-sources/game-api");

describe("Alice, Bob and Jane are the first users to ever join a game.", () => {
  let alice: User;
  let bob: User;
  let jane: User;

  const context = {
    dataSources: {
      gameAPI: new GameAPI("no-required"),
      gameStore: new GameStore()
    }
  } as TTTContext;

  beforeAll(async () => {
    const storage = `./join-game.test.sqlite`;
    await createStore({ storage }).sync({ force: true });
    [alice, bob, jane] = await UserModel.bulkCreate([
      { email: "alice@email.com" },
      { email: "bob@email.com" },
      { email: "jane@email.com" }
    ]).then(users => users.map(loginFromModel).map(({ user }) => user));
  });

  describe("Alice joins the first game ever, then:", () => {
    let game: Game;

    beforeAll(async () => {
      game = await joinGame(alice, context);
    });

    it("the game's state should be 'GameLobby'", () => {
      expect(game.__typename).toBe(GameTypename.GameLobby);
    });

    it("Alice should be the player 'waiting' at the lobby", () => {
      if (game.__typename === GameTypename.GameLobby) {
        expect(game.waiting.user).toStrictEqual(alice);
      } else {
        throw new Error("Unexpected game state");
      }
    });
  });

  describe("Alice joins another game, then:", () => {
    beforeAll(async () => {
      await joinGame(alice, context);
    });

    it("There should be two games", async () => {
      const games = await getAllGames(context);
      expect(games.length).toBe(2);
    });

    it("Alice should be waiting at the lobby of all games", async () => {
      const games = await getAllGames(context);
      const actual = games.map(game => {
        if (game.__typename === GameTypename.GameLobby) {
          return game.waiting.user.email;
        } else {
          throw new Error("Unexpected game state");
        }
      });
      expect(actual).toStrictEqual([alice.email, alice.email]);
    });
  });

  describe("Bob joins a game", () => {
    let game: Game;

    beforeAll(async () => {
      game = await joinGame(bob, context);
    });

    it("There should be two games", async () => {
      const games = await getAllGames(context);
      expect(games.length).toBe(2);
    });

    it("the game status should be 'GamePlaying'", () => {
      expect(game.__typename).toBe(GameTypename.GamePlaying);
    });

    it("Alice and Bob should be the players in the game", () => {
      if (game.__typename === GameTypename.GamePlaying) {
        const playerEmails = [game.oPlayer.user.email, game.xPlayer.user.email];
        const includesAlice = playerEmails.includes(alice.email);
        const includesBob = playerEmails.includes(bob.email);
        expect(includesAlice).toBeTruthy();
        expect(includesBob).toBeTruthy();
      } else {
        throw new Error(`unexpected game state "${game.__typename}"`);
      }
    });

    it("Alice OR Bob should be current player in the game", () => {
      if (game.__typename === GameTypename.GamePlaying) {
        const playerEmails = [alice.email, bob.email];
        const currentPlayerEmail = game.currentPlayer.user.email;
        const includesCurrentPlayer = playerEmails.includes(currentPlayerEmail);
        expect(includesCurrentPlayer).toBeTruthy();
      } else {
        throw new Error(`unexpected game state "${game.__typename}"`);
      }
    });
  });
});