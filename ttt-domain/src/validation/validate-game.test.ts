import { Game } from "model";
import {
  alice,
  bob,
  chris,
  narrowScenarios,
  validationLabel,
  trivialGame as game,
  dave,
} from "test";
import { validateGame } from "validation";
import * as result from "validation-result";
import { GameValidationResolvers } from "validation-result";

interface Scenario {
  name: string;
  game: Game;
  resolvers: GameValidationResolvers;
}

const scenarios = narrowScenarios<Scenario>([
  {
    name: "trivially valid game",
    game,
    resolvers: [result.valid],
  },
  {
    name: "smallest non-empty valid game",
    game: { ...game, moves: [[alice, 0]] },
    resolvers: [result.valid],
  },
  {
    name: "unknown player",
    game: { ...game, moves: [[chris, 0]] },
    resolvers: [result.invalidPlayersInMoves],
  },
  {
    name: "trivially valid players in moves",
    game: {
      ...game,
      moves: [
        [alice, 0],
        [bob, 1],
      ],
    },
    resolvers: [result.valid],
  },
  {
    name: "1 invalid unique player in moves",
    game: { ...game, moves: [[chris, 0]] },
    resolvers: [result.invalidPlayersInMoves],
  },
  {
    name: "2 invalid unique player in moves",
    game: {
      ...game,
      moves: [
        [chris, 0],
        [dave, 1],
      ],
    },
    resolvers: [result.invalidPlayersInMoves],
  },
  {
    name: "2 invalid duplicated players in moves",
    game: {
      ...game,
      moves: [
        [chris, 0],
        [dave, 1],
        [chris, 2],
        [dave, 3],
      ],
    },
    resolvers: [result.invalidPlayersInMoves],
  },
]);

describe.each(scenarios())("game validation", (scenario) => {
  const { name, game, resolvers } = scenario;
  const expected = result.combine(resolvers.map((r) => r(game)));

  it(validationLabel(name, result.isValid(expected)), () => {
    const actual = validateGame(game);
    expect(actual).toEqual(expected);
  });
});
