import { DataSourceConfig } from "apollo-datasource";
import { TTTContext } from "../environment";
import { create as createStore, GameModel, UserModel } from "../store";
import { GameStore } from "./game-store";

describe("Creating games for Alice and Bob", () => {
  const gameStore = new GameStore();
  gameStore.initialize({} as DataSourceConfig<TTTContext>);

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
      game1 = await gameStore.createGame(game1_Id, alice.id);
      game2 = await gameStore.createGame(game2_Id, alice.id);
    });

    it.todo("Alice should be playerO in game-1");
    it.todo("Alice should be playerO in game-2");
    it.todo("searching for the first game in lobby returns no results");

    describe("we want to add Bob to Alice's game", () => {
      it.todo("searching for a game in the lobby should return a result");
    });
  });
});
