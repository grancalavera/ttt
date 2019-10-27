import { GameAPI } from "../data-sources/game-api";
import { GameStore } from "../data-sources/game-store";
import { TTTContext } from "../environment";
import { Game, User } from "../generated/models";
import { loginFromModel } from "../model";
import { create as createStore, UserModel } from "../store";
import { joinGame } from "./join-game";

jest.mock("../data-sources/game-api");

const context = {
  dataSources: {
    gameAPI: new GameAPI("no-required"),
    gameStore: new GameStore()
  }
} as TTTContext;

describe("given there are no games on the system", () => {
  describe("when alice creates the first game", () => {
    it.todo("then alice should able to play a move");
    it.todo("and the next player should be bob");
  });

  describe("when bob joins alice's game", () => {
    it.todo("then bob should be able to play a move");
    it.todo("and the next player should be alice");
  });
});
