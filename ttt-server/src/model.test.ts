import { GameStateKindMap, AllStateKinds } from "./model";
import { assertNever } from "./common";

describe("StateKindMap", () => {
  it("should enumerate all state kinds", () => {
    AllStateKinds.forEach(kind => {
      switch (kind) {
        case GameStateKindMap.GameLobby:
          break;
        case GameStateKindMap.GameOverTie:
          break;
        case GameStateKindMap.GameOverWin:
          break;
        case GameStateKindMap.GamePlaying:
          break;
        default:
          assertNever(kind);
      }
    });
  });
});
