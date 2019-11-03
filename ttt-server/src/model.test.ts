import { GameTypename } from "./model";
import { assertNever } from "@grancalavera/ttt-core";

describe("StateKindMap", () => {
  it("should enumerate all state kinds", () => {
    Object.values(GameTypename).forEach(kind => {
      switch (kind) {
        case GameTypename.GameOverTie:
          break;
        case GameTypename.GameOverWin:
          break;
        case GameTypename.GamePlaying:
          break;
        default:
          assertNever(kind);
      }
    });
  });
});
