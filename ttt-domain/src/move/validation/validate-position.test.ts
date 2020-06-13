import { narrowScenarios, label, game, alice, bob } from "test";
import { MoveScenario } from "test/delete-me-move";
import { isValid, valid } from "validation";
import {
  validatePosition,
  invalidMoveOutOfRange,
  invalidMoveAlreadyPlayed,
} from "./validate-position";

const scenarios = narrowScenarios<MoveScenario>([
  {
    name: "the third move",
    input: { game, move: [alice, 2] },
    toValidation: valid,
  },
  {
    name: "already played move",
    input: {
      game: {
        ...game,
        moves: [
          [alice, 0],
          [bob, 1],
        ],
      },
      move: [alice, 0],
    },
    toValidation: invalidMoveAlreadyPlayed,
  },
  {
    name: "out of range move",
    input: {
      game,
      move: [alice, -1],
    },
    toValidation: invalidMoveOutOfRange,
  },
]);

describe.each(scenarios())("validate position in move", (scenario) => {
  const { name, input, toValidation } = scenario;
  const expected = toValidation(input);

  it(label(name, isValid(expected)), () => {
    const actual = validatePosition(input);
    expect(actual).toEqual(expected);
  });
});
