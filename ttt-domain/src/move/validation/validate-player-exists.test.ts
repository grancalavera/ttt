import { alice, chris, game, label, narrowScenarios } from "test";
import { MoveScenario } from "test/move";
import { isValid, valid } from "validation";
import {
  invalidMovePlayerDoesNotExist,
  validatePlayerExists,
} from "./validate-player-exists";

const scenarios = narrowScenarios<MoveScenario>([
  {
    name: "player exists",
    input: { game, move: [alice, 0] },
    toValidation: valid,
  },
  {
    name: "player does not exist",
    input: { game, move: [chris, 0] },
    toValidation: invalidMovePlayerDoesNotExist,
  },
]);

describe.each(scenarios())("validate player in move", (scenario) => {
  const { name, input, toValidation } = scenario;
  const expected = toValidation(input);

  it(label(name, isValid(expected)), () => {
    const actual = validatePlayerExists(input);
    expect(actual).toEqual(expected);
  });
});
