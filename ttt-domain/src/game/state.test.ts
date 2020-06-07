import { state } from "game/state";
import { GameValidationError } from "game/validation/types";
import { Game, GameStatus } from "model";
import { alice, game } from "test";
import { aliceWins, draw } from "test/game";

type Throws = ToThrow | NoToThrow;

interface ToThrow {
  kind: "ToThrow";
}

interface NoToThrow {
  kind: "NoToThrow";
  value: GameStatus;
}

const toThrow = (): ToThrow => ({ kind: "ToThrow" });
const notToThrow = (value: GameStatus): NoToThrow => ({ kind: "NoToThrow", value });
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
    game: aliceWins,
    expected: notToThrow({ kind: "WonGame", winner: [alice, [0, 3, 6]] }),
  },
  {
    name: "draw game",
    game: draw,
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
