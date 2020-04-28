import { state } from "game/state";
import { Game, GameState } from "model";
import { alice, bob, trivialGame as game } from "test";
import { GameValidationError } from "game/validation/types";

type Throws = ToThrow | NoToThrow;

interface ToThrow {
  kind: "ToThrow";
}

interface NoToThrow {
  kind: "NoToThrow";
  value: GameState;
}

const toThrow = (): ToThrow => ({ kind: "ToThrow" });
const notToThrow = (value: GameState): NoToThrow => ({ kind: "NoToThrow", value });
const throws = (t: Throws): t is ToThrow => t.kind === "ToThrow";

interface Scenario {
  name: string;
  game: Game;
  expected: ToThrow | NoToThrow;
}

const scenarios: Scenario[] = [
  {
    name: "open game",
    game,
    expected: notToThrow({ kind: "OpenGame", next: alice }),
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
    expected: notToThrow({ kind: "WonGame", winner: [alice, [0, 3, 6]] }),
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
    expected: notToThrow({ kind: "DrawGame" }),
  },
  {
    name: "invalid game",
    game: { ...game, players: [alice, alice] },
    expected: toThrow(),
  },
];

describe.each(scenarios)("resolve game state", (scenario) => {
  const { name, game, expected } = scenario;
  it(name, () => {
    if (throws(expected)) {
      expect(() => state(game)).toThrow(GameValidationError);
    } else {
      const actual = state(game);
      expect(actual).toEqual(expected.value);
    }
  });
});
