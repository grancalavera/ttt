import { alice } from "../../test/support";
import { allow, InvalidInput, Validation } from "@grancalavera/ttt-etc";
import { CreateMoveInput } from "./workflow";
import { aliceWinsGame, defaultGame, drawGame } from "./fixtures";
import {
  failWithInvalidGameStatus,
  validateGameStatusIsOpen,
} from "./validate-game-status-is-open";

interface Scenario {
  name: string;
  input: CreateMoveInput;
  expected: Validation<void, InvalidInput<CreateMoveInput>>;
}

const scenarios: Scenario[] = [
  {
    name: 'an "OpenGame" should be valid',
    input: { game: defaultGame, player: alice, playerPosition: 2 },
    expected: allow,
  },
  {
    name: 'a "DrawGame" should be invalid',
    input: { game: drawGame, player: alice, playerPosition: 2 },
    expected: failWithInvalidGameStatus({
      game: drawGame,
      player: alice,
      playerPosition: 2,
    }),
  },
  {
    name: 'a "WonGame" should be invalid',
    input: { game: aliceWinsGame, player: alice, playerPosition: 2 },
    expected: failWithInvalidGameStatus({
      game: aliceWinsGame,
      player: alice,
      playerPosition: 2,
    }),
  },
];

describe.each(scenarios)("play move: validate game status", (scenario) => {
  const { name, input, expected } = scenario;
  const actual = validateGameStatusIsOpen(input);

  it(name, () => {
    expect(actual).toEqual(expected);
  });
});
