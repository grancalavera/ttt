import { alice, trivialGame as game } from "test";
import { validateMove } from "./validate-move";

describe("root move validator ", () => {
  xit("should never throw", () => {
    expect(() => validateMove(game, [alice, 0])).not.toThrow();
  });
});
