import { Player, Players } from "model";
import { alice, bob, chris, label } from "test";
import { isValid } from "validation";
import { validatePlayerExists } from "./validate-player-exists";

interface Scenario {
  name: string;
  players: Players;
  player: Player;
  resolve: any;
}

const scenarios: Scenario[] = [
  {
    name: "alice",
    players: [alice, bob],
    player: alice,
    resolve: false,
  },
  {
    name: "bob",
    players: [alice, bob],
    player: bob,
    resolve: false,
  },
  {
    name: "chris",
    players: [alice, bob],
    player: chris,
    resolve: false,
  },
];

xdescribe.each(scenarios)("validate player in move", (scenario) => {
  const { name, player, players, resolve } = scenario;
  const expected = resolve(players, player);

  it(label(name, isValid(expected)), () => {
    const actual = validatePlayerExists(players, player);
    expect(actual).toEqual(expected);
  });
});
