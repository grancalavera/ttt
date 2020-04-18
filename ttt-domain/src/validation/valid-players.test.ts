import { alice, bob, shouldLabel } from "test";
import { validPlayers } from "validation/valid-players";
import { Players } from "../model";

interface Scenario {
  players: Players;
  expected: boolean;
}

const scenarios: Scenario[] = [
  { players: [alice, bob], expected: true },
  { players: [alice, alice], expected: false },
];

describe.each(scenarios)("validate players in game", (scenario) => {
  const { players, expected } = scenario;
  it(`${players} ${shouldLabel(expected)} be valid`, () => {
    const actual = validPlayers(players);
    expect(actual).toEqual(expected);
  });
});
