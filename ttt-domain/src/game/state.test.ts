import { Game, GameState } from "model";
import { state, Result, ok, failure } from "game/state";
import { alice, bob } from "test";

interface Scenario {
  name: string;
  game: Game;
  expected: Result<GameState, string>;
}

const game: Game = { size: 3, players: [alice, bob], moves: [] };

const scenarios: Scenario[] = [
  {
    name: "open game",
    game,
    expected: ok({ kind: "OpenGame", next: alice }),
  },
  {
    name: "won game",
    game: {
      ...game,
      moves: [
        [alice, 0],
        [bob, 1],
        [alice, 3],
        [bob, 4],
        [alice, 6],
      ],
    },
    expected: ok({ kind: "WonGame", winner: [alice, [0, 3, 6]] }),
  },
  {
    name: "draw game",
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
    expected: ok({ kind: "DrawGame" }),
  },
  {
    name: "invalid game",
    game: { ...game, players: [alice, alice] },
    expected: failure("invalid game"),
  },
];

describe.each(scenarios)("resolve game state", (scenario) => {
  const { name, game, expected } = scenario;
  it(name, () => {
    const actual = state(game);
    expect(actual).toEqual(expected);
  });
});
