import { GAME_LOBBY, GAME_OVER_TIE, GAME_PLAYING, GameStateKind } from "./model";
import { GAME_OVER_WIN } from "@grancalavera/ttt-core";
import { assertNever } from "./common";

describe("Enumerate all game state kinds (__typename?)", () => {
  it("should exhaustively enumerate all possible game states", () => {
    const allKinds: GameStateKind[] = [
      GAME_LOBBY,
      GAME_PLAYING,
      GAME_OVER_TIE,
      GAME_OVER_WIN
    ];

    allKinds.forEach(kind => {
      switch (kind) {
        case "GameLobby":
          break;
        case "GameOverTie":
          break;
        case "GameOverWin":
          break;
        case "GamePlaying":
          break;
        default:
          assertNever(kind);
      }
    });
  });
});
