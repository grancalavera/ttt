import {
  alice,
  bob,
  chris,
  dave,
  GameScenario,
  narrowScenarios,
  game,
  label,
} from "test";
import * as v from "validation/core";
import {
  invalidPlayersInMoves,
  validatePlayersInMoves,
} from "./validate-players-in-moves";

const scenarios = narrowScenarios<GameScenario>([
  {
    name: "trivially valid players in moves",
    input: {
      ...game,
      moves: [
        [alice, 0],
        [bob, 1],
      ],
    },
    toValidation: v.valid,
  },
  {
    name: "1 invalid unique player in moves",
    input: {
      ...game,
      moves: [
        [alice, 0],
        [bob, 1],
        [chris, 2],
      ],
    },
    toValidation: invalidPlayersInMoves,
  },
  {
    name: "2 invalid unique player in moves",
    input: {
      ...game,
      moves: [
        [alice, 0],
        [bob, 1],
        [chris, 2],
        [dave, 3],
      ],
    },
    toValidation: invalidPlayersInMoves,
  },
  {
    name: "2 invalid duplicated players in moves",
    input: {
      ...game,
      moves: [
        [chris, 0],
        [dave, 1],
        [chris, 2],
        [dave, 3],
      ],
    },
    toValidation: invalidPlayersInMoves,
  },
]);

describe.each(scenarios())("players in moves validation", (scenario) => {
  const { name, input: game, toValidation } = scenario;
  const expected = toValidation(game);
  it(label(name, v.isValid(expected)), () => {
    const actual = validatePlayersInMoves(game);
    expect(actual).toEqual(expected);
  });
});
