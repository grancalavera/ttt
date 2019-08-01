import { create as createStore, UserModel } from "./store";

describe("Alice, Bob and Jane are the first users to ever join a game.", () => {
  const storage = "./join-game.sqlite";

  let alice: UserModel;
  let bob: UserModel;
  let jane: UserModel;

  beforeAll(async () => {
    await createStore({ storage }).sync();
    [alice] = await UserModel.findOrCreate({ where: { email: "alice@email.com" } });
    [bob] = await UserModel.findOrCreate({ where: { email: "bob@email.com" } });
    [jane] = await UserModel.findOrCreate({ where: { email: "jane@email.com" } });
  });

  describe("Alice joins the first game ever, then:", () => {
    it.todo("the game's state should be 'GameLobby'");
    it.todo("Alice should be the player 'waiting' at the lobby");
  });

  describe("Alice joins another game, then:", () => {
    it.todo("the game's state should be 'GameLobby'");
    it.todo("Alice should be the player 'waiting' at the lobby of all existing games");
  });

  describe("Bob wants to join a game", () => {
    it.todo("a player can join the game when she's not already in the same game");
    it.todo(
      "a player should create a new game if she's already waiting in the only existing game"
    );
  });

  describe("Jane wants to join a game", () => {
    it.todo("a player can join the game when she's not already in the same game");
    it.todo(
      "a player should create a new game if she's already waiting in the only existing game"
    );
  });

  describe("when there are multiple games at the lobby", () => {
    it.todo(
      "a player will join the first game in which she's not already waiting at the lobby"
    );
    it.todo(
      "a player will create a new game if she's already waiting at every game's lobby"
    );
  });

  describe("when a player joins an existing game", () => {
    it.todo("the game's state should change to GamePlaying");
  });
});
