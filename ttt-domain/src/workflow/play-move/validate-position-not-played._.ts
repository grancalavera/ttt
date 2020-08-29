import { alice } from "../../test/support";
import { allow, InvalidInput, Validation } from "@grancalavera/ttt-etc";
import { CreateMoveInput } from "./workflow";
import { defaultGame } from "./fixtures";
import {
  failWithInvalidPosition,
  validatePositionNotPlayed,
} from "./validate-position-not-played";

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
    name: "new game: alice should not be allowed to play 0",
    input: { game: defaultGame, player: alice, playerPosition: 0 },
    expected: failWithInvalidPosition({
      game: defaultGame,
      player: alice,
      playerPosition: 0,
    }),
  },
];

describe.each(scenarios)("play move: validate position not played", (scenario) => {
  const { name, input, expected } = scenario;
  const actual = validatePositionNotPlayed(input);

  it(name, () => {
    expect(actual).toEqual(expected);
  });
});
