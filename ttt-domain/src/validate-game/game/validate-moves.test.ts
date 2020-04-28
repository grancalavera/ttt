import {
  alice,
  bob,
  chris,
  GameScenario,
  narrowScenarios,
  trivialGame as game,
  validationLabel,
} from "test";
import * as v from "validation/core";
import {
  validateMoves,
  invalidContinuity,
  invalidUniqueness,
  invalidRanges,
  invalidPlayerCount,
  invalidSingleWinner,
} from "./validate-moves";
import { toCombinedValidation } from "test/game";

const scenarios = narrowScenarios<GameScenario>([
  { name: "empty moves", game, toValidation: v.valid },
  {
    name: "no consecutive moves",
    game: {
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
    toValidation: v.valid,
  },
  {
    name: "consecutive moves",
    game: {
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
    game: {
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
    game: {
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
    game: { ...game, moves: [[alice, -1]] },
    toValidation: invalidRanges,
  },
  {
    name: "moves above range",
    game: { ...game, moves: [[alice, 9]] },
    toValidation: invalidRanges,
  },
  {
    name: "more than two players",
    game: {
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
    game: {
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
    game: {
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
    toValidation: toCombinedValidation([
      invalidContinuity,
      invalidUniqueness,
      invalidRanges,
      invalidPlayerCount,
      invalidSingleWinner,
    ]),
  },
]);

describe.each(scenarios())("validate moves in game", (scenario) => {
  const { name, game, toValidation } = scenario;

  const expected = toValidation(game);

  it(validationLabel(name, v.isValid(expected)), () => {
    const actual = validateMoves(game);
    expect(actual).toEqual(expected);
  });
});
