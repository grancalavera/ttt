import { alice, bob, validationLabel } from "test";
import { validPlayers } from "validation/valid-players";
import { Players } from "../model";

interface Scenario {
  name: string;
  players: Players;
  expected: boolean;
}

const scenarios: Scenario[] = [
  { name: "two unique players", players: [alice, bob], expected: true },
  { name: "two duplicated players", players: [alice, alice], expected: false },
];

describe.each(scenarios)("validate players in game", (scenario) => {
  const { name, players, expected } = scenario;
  it(validationLabel(name, expected), () => {
    const actual = validPlayers(players);
    expect(actual).toEqual(expected);
  });
});
