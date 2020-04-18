import { Player, Players } from "../model";
import { should } from "./should";
import { validPlayers } from "./valid-players";

const alice: Player = "alice";
const bob: Player = "bob";

interface Scenario {
  players: Players;
  expected: boolean;
}

const scenarios: Scenario[] = [
  { players: [alice, bob], expected: true },
  { players: [alice, alice], expected: false }
];

describe.each(scenarios)("validate players in game", scenario => {
  const { players, expected } = scenario;
  it(`${players} ${should(expected)} be valid`, () => {
    const actual = validPlayers(players);
    expect(actual).toEqual(expected);
  });
});
