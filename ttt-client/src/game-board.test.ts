import { assertNever } from "@grancalavera/ttt-core";
import { CellState, updateBoard } from "./game-board";
import { GameStatus, Move, Position, Token } from "./generated/graphql";

interface Scenario {
  name: string;
  game: GameStatus;
  expected: CellState[];
}

const scenarios: Scenario[] = [
  mkScenario(
    "empty moves",
    "GamePlaying",
    [],
    [
      { kind: "free", move: { position: Position.A, token: Token.O } },
      { kind: "free", move: { position: Position.B, token: Token.O } },
      { kind: "free", move: { position: Position.C, token: Token.O } },
      { kind: "free", move: { position: Position.D, token: Token.O } },
      { kind: "free", move: { position: Position.E, token: Token.O } },
      { kind: "free", move: { position: Position.F, token: Token.O } },
      { kind: "free", move: { position: Position.G, token: Token.O } },
      { kind: "free", move: { position: Position.H, token: Token.O } },
      { kind: "free", move: { position: Position.I, token: Token.O } },
    ]
  ),
  mkScenario(
    "first cell taken",
    "GamePlaying",
    [{ position: Position.A, token: Token.O }],
    [
      { kind: "played", move: { position: Position.A, token: Token.O } },
      { kind: "free", move: { position: Position.B, token: Token.O } },
      { kind: "free", move: { position: Position.C, token: Token.O } },
      { kind: "free", move: { position: Position.D, token: Token.O } },
      { kind: "free", move: { position: Position.E, token: Token.O } },
      { kind: "free", move: { position: Position.F, token: Token.O } },
      { kind: "free", move: { position: Position.G, token: Token.O } },
      { kind: "free", move: { position: Position.H, token: Token.O } },
      { kind: "free", move: { position: Position.I, token: Token.O } },
    ]
  ),
  mkScenario(
    "two non consecutive ordered cells taken",
    "GamePlaying",
    [
      { position: Position.A, token: Token.O },
      { position: Position.C, token: Token.O },
    ],
    [
      { kind: "played", move: { position: Position.A, token: Token.O } },
      { kind: "free", move: { position: Position.B, token: Token.O } },
      { kind: "played", move: { position: Position.C, token: Token.O } },
      { kind: "free", move: { position: Position.D, token: Token.O } },
      { kind: "free", move: { position: Position.E, token: Token.O } },
      { kind: "free", move: { position: Position.F, token: Token.O } },
      { kind: "free", move: { position: Position.G, token: Token.O } },
      { kind: "free", move: { position: Position.H, token: Token.O } },
      { kind: "free", move: { position: Position.I, token: Token.O } },
    ]
  ),
  mkScenario(
    "two non consecutive non ordered cells taken",
    "GamePlaying",
    [
      { position: Position.C, token: Token.O },
      { position: Position.A, token: Token.O },
    ],
    [
      { kind: "played", move: { position: Position.A, token: Token.O } },
      { kind: "free", move: { position: Position.B, token: Token.O } },
      { kind: "played", move: { position: Position.C, token: Token.O } },
      { kind: "free", move: { position: Position.D, token: Token.O } },
      { kind: "free", move: { position: Position.E, token: Token.O } },
      { kind: "free", move: { position: Position.F, token: Token.O } },
      { kind: "free", move: { position: Position.G, token: Token.O } },
      { kind: "free", move: { position: Position.H, token: Token.O } },
      { kind: "free", move: { position: Position.I, token: Token.O } },
    ]
  ),
  mkScenario(
    "three consecutive ordered cells taken",
    "GamePlaying",
    [
      { position: Position.A, token: Token.O },
      { position: Position.B, token: Token.O },
      { position: Position.C, token: Token.O },
    ],
    [
      { kind: "played", move: { position: Position.A, token: Token.O } },
      { kind: "played", move: { position: Position.B, token: Token.O } },
      { kind: "played", move: { position: Position.C, token: Token.O } },
      { kind: "free", move: { position: Position.D, token: Token.O } },
      { kind: "free", move: { position: Position.E, token: Token.O } },
      { kind: "free", move: { position: Position.F, token: Token.O } },
      { kind: "free", move: { position: Position.G, token: Token.O } },
      { kind: "free", move: { position: Position.H, token: Token.O } },
      { kind: "free", move: { position: Position.I, token: Token.O } },
    ]
  ),
  mkScenario(
    "three non consecutive non ordered cells taken",
    "GamePlaying",
    [
      { position: Position.C, token: Token.O },
      { position: Position.A, token: Token.O },
      { position: Position.B, token: Token.O },
    ],
    [
      { kind: "played", move: { position: Position.A, token: Token.O } },
      { kind: "played", move: { position: Position.B, token: Token.O } },
      { kind: "played", move: { position: Position.C, token: Token.O } },
      { kind: "free", move: { position: Position.D, token: Token.O } },
      { kind: "free", move: { position: Position.E, token: Token.O } },
      { kind: "free", move: { position: Position.F, token: Token.O } },
      { kind: "free", move: { position: Position.G, token: Token.O } },
      { kind: "free", move: { position: Position.H, token: Token.O } },
      { kind: "free", move: { position: Position.I, token: Token.O } },
    ]
  ),
  mkScenario(
    "all cells taken",
    "GamePlaying",
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
      { kind: "played", move: { position: Position.A, token: Token.O } },
      { kind: "played", move: { position: Position.B, token: Token.O } },
      { kind: "played", move: { position: Position.C, token: Token.O } },
      { kind: "played", move: { position: Position.D, token: Token.O } },
      { kind: "played", move: { position: Position.E, token: Token.O } },
      { kind: "played", move: { position: Position.F, token: Token.O } },
      { kind: "played", move: { position: Position.G, token: Token.O } },
      { kind: "played", move: { position: Position.H, token: Token.O } },
      { kind: "played", move: { position: Position.I, token: Token.O } },
    ]
  ),
  mkScenario(
    "draw",
    "GameDraw",
    [
      { position: Position.C, token: Token.O },
      { position: Position.A, token: Token.O },
      { position: Position.B, token: Token.O },
    ],
    [
      { kind: "played", move: { position: Position.A, token: Token.O } },
      { kind: "played", move: { position: Position.B, token: Token.O } },
      { kind: "played", move: { position: Position.C, token: Token.O } },
      { kind: "empty" },
      { kind: "empty" },
      { kind: "empty" },
      { kind: "empty" },
      { kind: "empty" },
      { kind: "empty" },
    ]
  ),
  mkScenario(
    "won",
    "GameWon",
    [
      { position: Position.C, token: Token.O },
      { position: Position.A, token: Token.O },
      { position: Position.B, token: Token.O },
    ],
    [
      { kind: "played", move: { position: Position.A, token: Token.O } },
      { kind: "played", move: { position: Position.B, token: Token.O } },
      { kind: "played", move: { position: Position.C, token: Token.O } },
      { kind: "empty" },
      { kind: "empty" },
      { kind: "empty" },
      { kind: "empty" },
      { kind: "empty" },
      { kind: "empty" },
    ]
  ),
];

describe.each(scenarios)("generateBoard", scenario => {
  const { name, game, expected } = scenario;
  it(name, () => {
    const actual = updateBoard(game);
    expect(actual).toEqual(expected);
  });
});

type Typename = Exclude<GameStatus["__typename"], undefined>;

function mkScenario(
  name: string,
  __typename: Typename = "GamePlaying",
  moves: Move[],
  expected: CellState[]
): Scenario {
  return {
    name,
    game: getGame(__typename, moves),
    expected,
  };
}

function getGame(__typename: Typename, moves: Move[]): GameStatus {
  switch (__typename) {
    case "GamePlaying":
      return { __typename, id: "0", me: Token.O, next: Token.O, moves };
    case "GameDraw":
      return { __typename, id: "0", me: Token.O, moves };
    case "GameWon":
      return { __typename, id: "0", me: Token.O, winner: Token.O, moves };
    default:
      return assertNever(__typename);
  }
}
