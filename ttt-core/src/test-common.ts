import assert from "assert";
import { Match } from "./game";

export const gameFromString = (s: String): Match => {
  return <Match>s
    .trim()
    .replace(/\n|\./g, "")
    .split("")
    .map((p, i) => [p, i])
    .filter(([p, _]) => p !== " ");
};

export const test = () => {
  assert.deepEqual(
    gameFromString(`
x o.
x  .
xo .
`),
    [["x", 0], ["o", 2], ["x", 3], ["x", 6], ["o", 7]],
    "should create a game from a string"
  );
};
