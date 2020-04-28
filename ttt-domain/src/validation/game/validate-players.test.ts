import { alice, GameScenario, trivialGame as game, validationLabel } from "test";
import * as v from "validation-result/core";
import { validatePlayers, invalidPlayers } from "./validate-players";

const scenarios: GameScenario[] = [
  { name: "two unique players", game, toValidation: v.valid },
  {
    name: "two duplicated players",
    game: { ...game, players: [alice, alice] },
    toValidation: invalidPlayers,
  },
];

describe.each(scenarios)("validate players in game", (scenario) => {
  const { name, game, toValidation } = scenario;
  const expected = toValidation(game);

  it(validationLabel(name, v.isValid(expected)), () => {
    const actual = validatePlayers(game);
    expect(actual).toEqual(expected);
  });
});
