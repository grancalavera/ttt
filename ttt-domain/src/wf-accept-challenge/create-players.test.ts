import { CreateGameInput, Players } from "model";
import { alice } from "test-support";
import { bob } from "test-support/players";
import { InvalidInput, valid, Validation } from "validation";
import { createPlayers, failWithInvalidPlayers } from "./create-players";
import {
  aliceAcceptsHerOwnChallengeWithOtherPosition,
  aliceAcceptsHerOwnChallengeWithTheSamePosition,
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
    name: "alice accepts her own challenge with the same position",
    input: aliceAcceptsHerOwnChallengeWithTheSamePosition,
    expected: failWithInvalidPlayers(aliceAcceptsHerOwnChallengeWithTheSamePosition),
  },
  {
    name: "alice accepts her own challenge with another other position",
    input: aliceAcceptsHerOwnChallengeWithOtherPosition,
    expected: failWithInvalidPlayers(aliceAcceptsHerOwnChallengeWithOtherPosition),
  },
  {
    name: "bob accepts alice's challenge with the same position",
    input: bobAcceptsAlicesChalengeWithHerSamePosition,
    expected: valid([alice, bob]),
  },
  {
    name: "bob accepts alice's challenge with another position",
    input: bobAcceptsAlicesChalengeWithHisOwnPosition,
    expected: valid([alice, bob]),
  },
];

describe.each(scenarios)("accept challenge: create players", (scenario) => {
  const { name, input, expected } = scenario;
  const actual = createPlayers(input);

  it(name, () => {
    expect(actual).toEqual(expected);
  });
});
