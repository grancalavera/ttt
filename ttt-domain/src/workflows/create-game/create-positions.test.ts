import { Position } from "../../domain/model";
import { InvalidInput, valid, Validation } from "../../../../ttt-etc/dist";
import { CreateGameInput } from "./workflow";
import { createPositions, failWithInvalidPositions } from "./create-positions";
import {
  aliceAcceptsHerOwnChallengeWithOtherPosition,
  aliceAcceptsHerOwnChallengeWithTheSamePosition,
  bobAcceptsAlicesChalengeWithHerSamePosition,
  bobAcceptsAlicesChalengeWithHisOwnPosition,
} from "./fixtures";

interface Scenario {
  name: string;
  input: CreateGameInput;
  expected: Validation<[Position, Position], InvalidInput<CreateGameInput>>;
}

const scenarios: Scenario[] = [
  {
    name: "alice accepts her own challenge with the same position",
    input: aliceAcceptsHerOwnChallengeWithTheSamePosition,
    expected: failWithInvalidPositions(aliceAcceptsHerOwnChallengeWithTheSamePosition),
  },
  {
    name: "alice accepts her own challenge with another position",
    input: aliceAcceptsHerOwnChallengeWithOtherPosition,
    expected: valid([0, 1]),
  },
  {
    name: "bob accepts alice's challenge with the same position",
    input: bobAcceptsAlicesChalengeWithHerSamePosition,
    expected: failWithInvalidPositions(bobAcceptsAlicesChalengeWithHerSamePosition),
  },
  {
    name: "bob accepts alice's challenge with another position",
    input: bobAcceptsAlicesChalengeWithHisOwnPosition,
    expected: valid([0, 1]),
  },
];

describe.each(scenarios)("accept challenge: create moves", (scenario) => {
  const { name, input, expected } = scenario;
  const actual = createPositions(input);

  it(name, () => {
    expect(actual).toEqual(expected);
  });
});
