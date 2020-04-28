import { trivialGame as game } from "test";
import { validateGame } from "./validate-game";

describe("root game validator ", () => {
  it("should never throw", () => {
    expect(() => validateGame(game)).not.toThrow();
  });
});
