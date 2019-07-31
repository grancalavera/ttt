describe("joining new games", () => {
  describe("when there are NO GAMES", () => {
    it.todo("a player joining creates a new game");
    it.todo("the first game created has ONE player in the lobby");
    it.todo("the first game crated state's should be GameLobby");
  });

  describe("when there is ONE GAME at the lobby", () => {
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
