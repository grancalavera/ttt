import { CellState, generateBoard } from "./game-board";
import { GamePlaying, Move, Position, Token } from "./generated/graphql";

interface Scenario {
  name: string;
  game: GamePlaying;
  expected: CellState[];
}

const scenarios: Scenario[] = [
  mkScenario(
    "empty moves",
    [],
    [
      { isFree: true, move: { position: Position.A, token: Token.O } },
      { isFree: true, move: { position: Position.B, token: Token.O } },
      { isFree: true, move: { position: Position.C, token: Token.O } },
      { isFree: true, move: { position: Position.D, token: Token.O } },
      { isFree: true, move: { position: Position.E, token: Token.O } },
      { isFree: true, move: { position: Position.F, token: Token.O } },
      { isFree: true, move: { position: Position.G, token: Token.O } },
      { isFree: true, move: { position: Position.H, token: Token.O } },
      { isFree: true, move: { position: Position.I, token: Token.O } },
    ]
  ),
  mkScenario(
    "first cell taken",
    [{ position: Position.A, token: Token.O }],
    [
      { isFree: false, move: { position: Position.A, token: Token.O } },
      { isFree: true, move: { position: Position.B, token: Token.O } },
      { isFree: true, move: { position: Position.C, token: Token.O } },
      { isFree: true, move: { position: Position.D, token: Token.O } },
      { isFree: true, move: { position: Position.E, token: Token.O } },
      { isFree: true, move: { position: Position.F, token: Token.O } },
      { isFree: true, move: { position: Position.G, token: Token.O } },
      { isFree: true, move: { position: Position.H, token: Token.O } },
      { isFree: true, move: { position: Position.I, token: Token.O } },
    ]
  ),
  mkScenario(
    "two non consecutive ordered cells taken",
    [
      { position: Position.A, token: Token.O },
      { position: Position.C, token: Token.O },
    ],
    [
      { isFree: false, move: { position: Position.A, token: Token.O } },
      { isFree: true, move: { position: Position.B, token: Token.O } },
      { isFree: false, move: { position: Position.C, token: Token.O } },
      { isFree: true, move: { position: Position.D, token: Token.O } },
      { isFree: true, move: { position: Position.E, token: Token.O } },
      { isFree: true, move: { position: Position.F, token: Token.O } },
      { isFree: true, move: { position: Position.G, token: Token.O } },
      { isFree: true, move: { position: Position.H, token: Token.O } },
      { isFree: true, move: { position: Position.I, token: Token.O } },
    ]
  ),
  mkScenario(
    "two non consecutive non ordered cells taken",
    [
      { position: Position.C, token: Token.O },
      { position: Position.A, token: Token.O },
    ],
    [
      { isFree: false, move: { position: Position.A, token: Token.O } },
      { isFree: true, move: { position: Position.B, token: Token.O } },
      { isFree: false, move: { position: Position.C, token: Token.O } },
      { isFree: true, move: { position: Position.D, token: Token.O } },
      { isFree: true, move: { position: Position.E, token: Token.O } },
      { isFree: true, move: { position: Position.F, token: Token.O } },
      { isFree: true, move: { position: Position.G, token: Token.O } },
      { isFree: true, move: { position: Position.H, token: Token.O } },
      { isFree: true, move: { position: Position.I, token: Token.O } },
    ]
  ),
  mkScenario(
    "three consecutive ordered cells taken",
    [
      { position: Position.A, token: Token.O },
      { position: Position.B, token: Token.O },
      { position: Position.C, token: Token.O },
    ],
    [
      { isFree: false, move: { position: Position.A, token: Token.O } },
      { isFree: false, move: { position: Position.B, token: Token.O } },
      { isFree: false, move: { position: Position.C, token: Token.O } },
      { isFree: true, move: { position: Position.D, token: Token.O } },
      { isFree: true, move: { position: Position.E, token: Token.O } },
      { isFree: true, move: { position: Position.F, token: Token.O } },
      { isFree: true, move: { position: Position.G, token: Token.O } },
      { isFree: true, move: { position: Position.H, token: Token.O } },
      { isFree: true, move: { position: Position.I, token: Token.O } },
    ]
  ),
  mkScenario(
    "three non consecutive non ordered cells taken",
    [
      { position: Position.C, token: Token.O },
      { position: Position.A, token: Token.O },
      { position: Position.B, token: Token.O },
    ],
    [
      { isFree: false, move: { position: Position.A, token: Token.O } },
      { isFree: false, move: { position: Position.B, token: Token.O } },
      { isFree: false, move: { position: Position.C, token: Token.O } },
      { isFree: true, move: { position: Position.D, token: Token.O } },
      { isFree: true, move: { position: Position.E, token: Token.O } },
      { isFree: true, move: { position: Position.F, token: Token.O } },
      { isFree: true, move: { position: Position.G, token: Token.O } },
      { isFree: true, move: { position: Position.H, token: Token.O } },
      { isFree: true, move: { position: Position.I, token: Token.O } },
    ]
  ),
  mkScenario(
    "all cells taken",
    [
      { position: Position.A, token: Token.O },
      { position: Position.B, token: Token.O },
      { position: Position.C, token: Token.O },
      { position: Position.D, token: Token.O },
      { position: Position.E, token: Token.O },
      { position: Position.F, token: Token.O },
      { position: Position.G, token: Token.O },
      { position: Position.H, token: Token.O },
      { position: Position.I, token: Token.O },
    ],
    [
      { isFree: false, move: { position: Position.A, token: Token.O } },
      { isFree: false, move: { position: Position.B, token: Token.O } },
      { isFree: false, move: { position: Position.C, token: Token.O } },
      { isFree: false, move: { position: Position.D, token: Token.O } },
      { isFree: false, move: { position: Position.E, token: Token.O } },
      { isFree: false, move: { position: Position.F, token: Token.O } },
      { isFree: false, move: { position: Position.G, token: Token.O } },
      { isFree: false, move: { position: Position.H, token: Token.O } },
      { isFree: false, move: { position: Position.I, token: Token.O } },
    ]
  ),
];

describe.each(scenarios)("generateBoard", scenario => {
  const { name, game, expected } = scenario;
  it(name, () => {
    const actual = generateBoard(game);
    expect(actual).toEqual(expected);
  });
});

function mkScenario(name: string, moves: Move[], expected: CellState[]): Scenario {
  return { name, game: { id: "0", me: Token.O, next: Token.O, moves }, expected };
}
