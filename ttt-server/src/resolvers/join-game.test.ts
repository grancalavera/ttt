import { GameAPI } from "../data-sources/game-api";
import { GameStore } from "../data-sources/game-store";
import { TTTContext } from "../environment";
import { User, JoinGameResult } from "../generated/models";
import { userFromModel } from "../model";
import { create as createStore, UserModel } from "../store";
import uuid = require("uuid");
import { joinGame } from "./join-game";
import { playMove } from "./play-move";

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

  describe("when alice joins the first game as the first player", () => {
    let result: JoinGameResult;
    beforeAll(async () => {
      result = await joinGame(alice, context);
    });

    it("then alice should able to play a move", () => {
      if (result.__typename === "GamePlaying") {
        playMove(result.id, "O", 0, context);
      } else {
        throw new Error(`unexpected play move result ${result.__typename}`);
      }
    });

    it.todo("and the next player should be bob");
  });

  describe("when bob joins the first game as the second player", () => {
    it("then bob should be able to play a move", () => {
      console.log(bob);
    });
    it.todo("and the next player should be alice");
  });
});
