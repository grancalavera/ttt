import { CreateGameInput, Players } from "model";
import { alice } from "test";
import { bob } from "test/players";
import { InvalidInput, valid, Validation } from "validation";
import { createPlayers, invalidPlayers } from "./create-players";
import {
  aliceAcceptsHerOwnChallenge,
  bobAcceptsAlicesChalengeWithHerSamePosition,
  bobAcceptsAlicesChalengeWithHisOwnPosition,
} from "./fixtures";

interface Scenario {
  name: string;
  input: CreateGameInput;
  expected: Validation<Players, InvalidInput<CreateGameInput>>;
}

const scenarios: Scenario[] = [
  {
    name: "alice accepts her own challenge",
    input: aliceAcceptsHerOwnChallenge,
    expected: invalidPlayers(aliceAcceptsHerOwnChallenge),
  },
  {
    name: "bob accepts alice's challenge with her same position",
    input: bobAcceptsAlicesChalengeWithHerSamePosition,
    expected: valid([alice, bob]),
  },
  {
    name: "bob accepts alice's challenge with his own position",
    input: bobAcceptsAlicesChalengeWithHisOwnPosition,
    expected: valid([alice, bob]),
  },
];

describe.each(scenarios)("create players", (scenario) => {
  const { name, input, expected } = scenario;
  it(name, () => {
    const actual = createPlayers(input);
    expect(actual).toEqual(expected);
  });
});
