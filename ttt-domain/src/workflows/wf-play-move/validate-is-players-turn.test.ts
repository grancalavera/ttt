import { CreateMoveInput } from "../../model";
import { alice, bob, chris } from "../../test-support";
import { allow, InvalidInput, Validation } from "../../validation";
import { defaultGame, drawGame, aliceWinsGame } from "./fixtures";
import { failWithInvalidTurn, validateIsPlayersTurn } from "./validate-is-players-turn";

interface Scenario {
  name: string;
  input: CreateMoveInput;
  expected: Validation<void, InvalidInput<CreateMoveInput>>;
}

const scenarios: Scenario[] = [
  {
    name: "new game: alice should play next",
    input: { game: defaultGame, player: alice, playerPosition: 2 },
    expected: allow,
  },
  {
    name: "new game: bob should not play next",
    input: { game: defaultGame, player: bob, playerPosition: 2 },
    expected: failWithInvalidTurn({
      game: defaultGame,
      player: bob,
      playerPosition: 2,
    }),
  },
  {
    name: "new game: unknown player should never be next",
    input: { game: defaultGame, player: chris, playerPosition: 2 },
    expected: failWithInvalidTurn({
      game: defaultGame,
      player: chris,
      playerPosition: 2,
    }),
  },
  {
    name: "draw game: alice should never be next",
    input: { game: drawGame, player: alice, playerPosition: 2 },
    expected: failWithInvalidTurn({ game: drawGame, player: alice, playerPosition: 2 }),
  },
  {
    name: "draw game: bob should never be next",
    input: { game: drawGame, player: bob, playerPosition: 2 },
    expected: failWithInvalidTurn({ game: drawGame, player: bob, playerPosition: 2 }),
  },
  {
    name: "won game: alice should never be next",
    input: { game: aliceWinsGame, player: bob, playerPosition: 2 },
    expected: failWithInvalidTurn({
      game: aliceWinsGame,
      player: bob,
      playerPosition: 2,
    }),
  },
  {
    name: "won game: bob should never be next",
    input: { game: aliceWinsGame, player: bob, playerPosition: 2 },
    expected: failWithInvalidTurn({
      game: aliceWinsGame,
      player: bob,
      playerPosition: 2,
    }),
  },
];

describe.each(scenarios)("play move: validate is player's turn", (scenario) => {
  const { name, input, expected } = scenario;
  const actual = validateIsPlayersTurn(input);

  it(name, () => {
    expect(actual).toEqual(expected);
  });
});
