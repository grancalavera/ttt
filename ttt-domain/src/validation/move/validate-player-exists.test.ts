import { Player, Players } from "model";
import { alice, bob, chris, validationLabel } from "test";
import * as result from "validation-result";
import { ValidationResult } from "validation-result";
import { InvalidPlayer } from "validation-result/types";
import { validatePlayerExists } from "./validate-player-exists";

interface Scenario {
  name: string;
  players: Players;
  player: Player;
  resolve: (players: Players, player: Player) => ValidationResult<InvalidPlayer>;
}

const scenarios: Scenario[] = [
  {
    name: "alice",
    players: [alice, bob],
    player: alice,
    resolve: result.valid,
  },
  {
    name: "bob",
    players: [alice, bob],
    player: bob,
    resolve: result.valid,
  },
  {
    name: "chris",
    players: [alice, bob],
    player: chris,
    resolve: result.invalidPlayer,
  },
];

xdescribe.each(scenarios)("validate player in move", (scenario) => {
  const { name, player, players, resolve } = scenario;
  const expected = resolve(players, player);

  it(validationLabel(name, result.isValid(expected)), () => {
    const actual = validatePlayerExists(players, player);
    expect(actual).toEqual(expected);
  });
});
