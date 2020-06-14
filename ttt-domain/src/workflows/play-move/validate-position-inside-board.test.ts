import { CreateMoveInput } from "../../model";
import { alice } from "../../test-support";
import { allow, InvalidInput, Validation } from "../../validation";
import { defaultGame } from "./fixtures";
import {
  failWithInvalidPositionOutsideBoard,
  validatePositionInsideBoard,
} from "./validate-position-inside-board";

interface Scenario {
  name: string;
  input: CreateMoveInput;
  expected: Validation<void, InvalidInput<CreateMoveInput>>;
}

const scenarios: Scenario[] = [
  {
    name: "new game: alice should be allowed to play 2",
    input: { game: defaultGame, player: alice, playerPosition: 2 },
    expected: allow,
  },
  {
    name: "new game: alice should not be allowed to play -1",
    input: { game: defaultGame, player: alice, playerPosition: -1 },
    expected: failWithInvalidPositionOutsideBoard({
      game: defaultGame,
      player: alice,
      playerPosition: -1,
    }),
  },
  {
    name: "new game: alice should not be allowed to play 9",
    input: { game: defaultGame, player: alice, playerPosition: 9 },
    expected: failWithInvalidPositionOutsideBoard({
      game: defaultGame,
      player: alice,
      playerPosition: 9,
    }),
  },
];

describe.each(scenarios)("play move: validate position is inside board", (scenario) => {
  const { name, input, expected } = scenario;
  const actual = validatePositionInsideBoard(input);

  it(name, () => {
    expect(actual).toEqual(expected);
  });
});
