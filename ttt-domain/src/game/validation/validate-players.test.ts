import { alice, GameScenario, game, label } from "test";
import * as v from "validation/core";
import { validatePlayers, invalidPlayers } from "./validate-players";

const scenarios: GameScenario[] = [
  { name: "two unique players", input: game, toValidation: v.valid },
  {
    name: "two duplicated players",
    input: { ...game, players: [alice, alice] },
    toValidation: invalidPlayers,
  },
];

describe.each(scenarios)("validate players in game", (scenario) => {
  const { name, input: game, toValidation } = scenario;
  const expected = toValidation(game);

  it(label(name, v.isValid(expected)), () => {
    const actual = validatePlayers(game);
    expect(actual).toEqual(expected);
  });
});
