import { alice, game, label, narrowScenarios } from "test";
import { aliceWins, draw } from "test/game";
import { MoveScenario } from "test/move";
import { isValid, valid } from "validation";
import { invalidMoveGameOver, validateGameState } from "./validate-game-state";

const scenarios = narrowScenarios<MoveScenario>([
  {
    name: "play move on OpenGame",
    input: { game, move: [alice, 0] },
    toValidation: valid,
  },
  {
    name: "play move on WonGame",
    input: { game: aliceWins, move: [alice, 0] },
    toValidation: invalidMoveGameOver,
  },
  {
    name: "play move on DrawGame",
    input: { game: draw, move: [alice, 0] },
    toValidation: invalidMoveGameOver,
  },
]);

describe.each(scenarios())("validate game state is open", (scenario) => {
  const { name, input, toValidation } = scenario;
  const expected = toValidation(input);

  it(label(name, isValid(expected)), () => {
    const actual = validateGameState(input);
    expect(actual).toEqual(expected);
  });
});
