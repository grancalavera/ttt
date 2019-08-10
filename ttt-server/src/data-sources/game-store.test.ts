import { UserModel, GameModel } from "../store";
import { create as createStore } from "../store";
import { GameStore } from "./game-store";
import { Context } from "../environment";
import { DataSourceConfig } from "apollo-datasource";
import { Avatar } from "../generated/models";

describe("Creating games for Alice and Bob", () => {
  const gameStore = new GameStore();
  gameStore.initialize({} as DataSourceConfig<Context>);

  let alice: UserModel;
  let bob: UserModel;

  beforeAll(async () => {
    const storage = "./game-store.test.sqlite";
    const force = true;
    await createStore({ storage }).sync({ force });

    [alice, bob] = await UserModel.bulkCreate([
      { email: "alice@email.com" },
      { email: "bob@email.com" }
    ]);
  });

  describe("a new game is created with Alice as playerO", () => {
    let game1: GameModel;
    let game2: GameModel;

    const game1_Id = "game-1";
    const game2_Id = "game-2";

    beforeAll(async () => {
      game1 = await gameStore.createGame(game1_Id, alice.id, Avatar.O);
      game2 = await gameStore.createGame(game2_Id, alice.id, Avatar.O);
      await gameStore.reloadPlayers(game1);
      await gameStore.reloadPlayers(game2);
    });

    it("Alice should be playerO in game-1", () => {
      expect(game1.playerO!.user!.id).toBe(alice.id);
    });

    it("Alice should be playerO in game-2", () => {
      expect(game2.playerO!.user!.id).toBe(alice.id);
    });

    it("searching for the first game in lobby returns no results", async () => {
      const gameInLobby = await gameStore.firstGameInLobby(alice.id);
      expect(gameInLobby).toBe(null);
    });

    describe("we want to add Bob to Alice's game", () => {
      it("searching for a game in the lobby should return a result", async () => {
        const gameInLobby = await gameStore.firstGameInLobby(bob.id);
        expect(gameInLobby!.id).toBe(game1_Id);
      });
    });
  });
});
