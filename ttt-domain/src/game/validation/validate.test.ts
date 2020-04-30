import { game } from "test";
import { validate } from "./validate";

describe("root game validator ", () => {
  it("should never throw", () => {
    expect(() => validate(game)).not.toThrow();
  });
});
