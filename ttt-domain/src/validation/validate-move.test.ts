import { trivialGame as game, alice } from "test";
import { Move } from "model";
import { validateMove } from "./validate-move";

describe("root move validator ", () => {
  it("should never throw", () => {
    const move: Move = [alice, 0];
    expect(() => validateMove(game, move)).not.toThrow();
  });
});
