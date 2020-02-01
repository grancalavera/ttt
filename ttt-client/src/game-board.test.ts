import { assertNever } from "@grancalavera/ttt-core";
import { CellState, updateBoard } from "./game-board";
import {
  GameStatus,
  Move,
  Position,
  Token,
  GamePlaying,
  GameWon,
  GameDraw,
} from "./generated/graphql";

interface Scenario {
  name: string;
  game: GameStatus;
  expected: CellState[];
}

const PLAYING_NEXT_O_ME_O: GamePlaying = {
  __typename: "GamePlaying",
  id: "0",
  me: Token.O,
  moves: [],
  next: Token.O,
};

const PLAYING_NEXT_X_ME_O: GamePlaying = {
  __typename: "GamePlaying",
  id: "0",
  me: Token.O,
  moves: [],
  next: Token.X,
};

const WON: GameWon = {
  __typename: "GameWon",
  id: "0",
  me: Token.O,
  winner: Token.O,
  moves: [],
};

const DRAW: GameDraw = {
  __typename: "GameDraw",
  id: "0",
  me: Token.O,
  moves: [],
};

const scenarios: Scenario[] = [
  mkScenario("empty moves", PLAYING_NEXT_O_ME_O, [
    { kind: "free", move: { position: Position.A, token: Token.O } },
    { kind: "free", move: { position: Position.B, token: Token.O } },
    { kind: "free", move: { position: Position.C, token: Token.O } },
    { kind: "free", move: { position: Position.D, token: Token.O } },
    { kind: "free", move: { position: Position.E, token: Token.O } },
    { kind: "free", move: { position: Position.F, token: Token.O } },
    { kind: "free", move: { position: Position.G, token: Token.O } },
    { kind: "free", move: { position: Position.H, token: Token.O } },
    { kind: "free", move: { position: Position.I, token: Token.O } },
  ]),
  mkScenario(
    "first cell taken",
    { ...PLAYING_NEXT_O_ME_O, moves: [{ position: Position.A, token: Token.O }] },
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
    {
      ...PLAYING_NEXT_O_ME_O,
      moves: [
        { position: Position.A, token: Token.O },
        { position: Position.C, token: Token.O },
      ],
    },
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
    {
      ...PLAYING_NEXT_O_ME_O,
      moves: [
        { position: Position.C, token: Token.O },
        { position: Position.A, token: Token.O },
      ],
    },
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
    {
      ...PLAYING_NEXT_O_ME_O,
      moves: [
        { position: Position.A, token: Token.O },
        { position: Position.B, token: Token.O },
        { position: Position.C, token: Token.O },
      ],
    },
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
    {
      ...PLAYING_NEXT_O_ME_O,
      moves: [
        { position: Position.C, token: Token.O },
        { position: Position.A, token: Token.O },
        { position: Position.B, token: Token.O },
      ],
    },
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
    {
      ...PLAYING_NEXT_O_ME_O,
      moves: [
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
    },
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
    {
      ...DRAW,
      moves: [
        { position: Position.C, token: Token.O },
        { position: Position.A, token: Token.O },
        { position: Position.B, token: Token.O },
      ],
    },
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
    {
      ...WON,
      moves: [
        { position: Position.C, token: Token.O },
        { position: Position.A, token: Token.O },
        { position: Position.B, token: Token.O },
      ],
    },
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

function mkScenario(name: string, game: GameStatus, expected: CellState[]): Scenario {
  return {
    name,
    game,
    expected,
  };
}
