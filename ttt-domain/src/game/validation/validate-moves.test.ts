import { alice, bob, chris, GameScenario, narrowScenarios, game, label } from "test";
import { isValid, valid, validations } from "validation";
import {
  invalidContinuity,
  invalidPlayerCount,
  invalidRanges,
  invalidSingleWinner,
  invalidUniqueness,
  validateMoves,
} from "./validate-moves";

const scenarios = narrowScenarios<GameScenario>([
  { name: "empty moves", input: game, toValidation: valid },
  {
    name: "no consecutive moves",
    input: {
      ...game,
      moves: [
        [alice, 0],
        [bob, 3],
        [alice, 6],
        [bob, 4],
        [alice, 1],
        [bob, 2],
        [alice, 5],
        [bob, 7],
        [alice, 8],
      ],
    },
    toValidation: valid,
  },
  {
    name: "consecutive moves",
    input: {
      ...game,
      moves: [
        [alice, 0],
        [alice, 1],
      ],
    },
    toValidation: invalidContinuity,
  },
  {
    name: "consecutive moves",
    input: {
      ...game,
      moves: [
        [alice, 0],
        [bob, 1],
        [alice, 2],
        [bob, 3],
        [bob, 4],
      ],
    },
    toValidation: invalidContinuity,
  },
  {
    name: "duplicated moves",
    input: {
      ...game,
      moves: [
        [alice, 0],
        [bob, 0],
      ],
    },
    toValidation: invalidUniqueness,
  },
  {
    name: "moves below range",
    input: { ...game, moves: [[alice, -1]] },
    toValidation: invalidRanges,
  },
  {
    name: "moves above range",
    input: { ...game, moves: [[alice, 9]] },
    toValidation: invalidRanges,
  },
  {
    name: "more than two players",
    input: {
      ...game,
      moves: [
        [alice, 0],
        [bob, 1],
        [chris, 2],
      ],
    },
    toValidation: invalidPlayerCount,
  },
  {
    name: "multiple winners",
    input: {
      ...game,
      moves: [
        [alice, 0],
        [bob, 1],
        [alice, 3],
        [bob, 4],
        [alice, 6],
        [bob, 7],
      ],
    },
    toValidation: invalidSingleWinner,
  },
  {
    name: "every invalid result",
    input: {
      ...game,
      moves: [
        [alice, 0],
        [alice, 2],
        [alice, 1],
        [bob, 3],
        [bob, 4],
        [bob, 5],
        [chris, 0],
        [alice, -1],
      ],
    },
    toValidation: validations([
      invalidContinuity,
      invalidUniqueness,
      invalidRanges,
      invalidPlayerCount,
      invalidSingleWinner,
    ]),
  },
]);

describe.each(scenarios())("validate moves in game", (scenario) => {
  const { name, input: game, toValidation } = scenario;

  const expected = toValidation(game);

  it(label(name, isValid(expected)), () => {
    const actual = validateMoves(game);
    expect(actual).toEqual(expected);
  });
});
