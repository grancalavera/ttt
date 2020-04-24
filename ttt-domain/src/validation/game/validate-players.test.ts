import { alice, bob, validationLabel } from "test";
import * as result from "validation-result";
import { InvalidPlayers, ValidationResult } from "validation-result";
import { validatePlayers } from "validation/game/validate-players";
import { Players } from "../../model";

interface Scenario {
  name: string;
  players: Players;
  resolve: (players: Players) => ValidationResult<InvalidPlayers>;
}

const scenarios: Scenario[] = [
  { name: "two unique players", players: [alice, bob], resolve: result.valid },
  {
    name: "two duplicated players",
    players: [alice, alice],
    resolve: result.invalidPlayers,
  },
];

describe.each(scenarios)("validate players in game", (scenario) => {
  const { name, players, resolve } = scenario;
  const expected = resolve(players);

  it(validationLabel(name, result.isValid(expected)), () => {
    const actual = validatePlayers(players);
    expect(actual).toEqual(expected);
  });
});
