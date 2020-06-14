import { CreateMoveInput } from "model";
import { alice, bob, chris } from "test-support";
import { allow, InvalidInput, Validation } from "validation";
import { defaultGame } from "./fixtures";
import {
  failWithInvalidPlayer,
  validatePlayerExistsInGame,
} from "./validate-player-exists-in-game";

interface Scenario {
  name: string;
  input: CreateMoveInput;
  expected: Validation<void, InvalidInput<CreateMoveInput>>;
}

const scenarios: Scenario[] = [
  {
    name: "alice exists in game",
    input: { game: defaultGame, player: alice, playerPosition: 2 },
    expected: allow,
  },
  {
    name: "bob exists in game (even when he's not next)",
    input: { game: defaultGame, player: bob, playerPosition: 2 },
    expected: allow,
  },
  {
    name: "chris doesn't exist in game",
    input: { game: defaultGame, player: chris, playerPosition: 2 },
    expected: failWithInvalidPlayer({
      game: defaultGame,
      player: chris,
      playerPosition: 2,
    }),
  },
];

describe.each(scenarios)("play move: validate player exists in game", (scenario) => {
  const { name, input, expected } = scenario;
  const actual = validatePlayerExistsInGame(input);

  it(name, () => {
    expect(actual).toEqual(expected);
  });
});
