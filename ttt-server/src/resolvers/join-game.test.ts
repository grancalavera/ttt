import { GameAPI } from "../data-sources/game-api";
import { GameStore } from "../data-sources/game-store";
import { TTTContext } from "../environment";
import { Game, User } from "../generated/models";
import { loginFromModel, userFromModel } from "../model";
import { create as createStore, UserModel } from "../store";
import { joinGame } from "./join-game";
import uuid = require("uuid");

jest.mock("../data-sources/game-api");

const context = {
  dataSources: {
    gameAPI: new GameAPI("no-required"),
    gameStore: new GameStore()
  }
} as TTTContext;

describe("given there are no games on the system", () => {
  let alice: User;
  let bob: User;

  beforeAll(async () => {
    const storage = `./join-game.test.sqlite`;
    await createStore({ storage }).sync({ force: true });
    [alice, bob] = await UserModel.bulkCreate([{ id: "alice" }, { id: "bob" }]).then(
      users => users.map(userFromModel)
    );
  });

  describe("when alice creates the first game", () => {
    it("then alice should able to play a move", () => {
      console.log(alice);
    });
    it.todo("and the next player should be bob");
  });

  describe("when bob joins alice's game", () => {
    it("then bob should be able to play a move", () => {
      console.log(bob);
    });
    it.todo("and the next player should be alice");
  });
});
