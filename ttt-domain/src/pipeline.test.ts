import { failure, Result, success } from "@grancalavera/ttt-etc";
import { Command, JoinGameCommand, PlayMoveCommand } from "./command/support";
import {
  DomainError,
  MatchNotFoundError,
  NoChallengesFoundError,
  ZeroError,
} from "./domain/error";
import { extractMatchDescription, Match } from "./domain/model";
import { AsyncDomainResult, DomainResult } from "./domain/result";
import { buildPipeline } from "./pipeline";
import { alice, bob, matchId } from "./test-support";

let initialState: InitialState = {};

interface InitialState {
  match?: Match;
}

interface Scenario {
  name: string;
  initialState: InitialState;
  expected: Result<Match, DomainError[]>;
  commands: Command[];
}

const runPipeline = buildPipeline({
  gameSize: 3,
  maxActiveMatches: 1,
  maxMoves: 3 * 3,

  findMatch: async (id) => {
    const { match } = initialState;
    return match === undefined ? failure(new MatchNotFoundError(id)) : success(match);
  },
  findFirstChallenge: async () => {
    const { match } = initialState;
    return match?.state.kind === "Challenge"
      ? success([extractMatchDescription(match), match.state])
      : failure(new NoChallengesFoundError());
  },
  countActiveMatches: async () => 0,
  getUniqueId: () => matchId,
  upsertMatch: async (match) => {
    initialState.match = match;
    return success(undefined);
  },
});

const setupScenario = (initial: InitialState) => {
  initialState = initial;
};

const scenarios: Scenario[] = [
  {
    name: "alice creates a match and wins",
    initialState: {},
    commands: [
      new JoinGameCommand({ player: alice }),
      new PlayMoveCommand({ matchId, move: [alice, 0] }),
      new JoinGameCommand({ player: bob }),
      new PlayMoveCommand({ matchId, move: [bob, 1] }),
      new PlayMoveCommand({ matchId, move: [alice, 3] }),
      new PlayMoveCommand({ matchId, move: [bob, 4] }),
      new PlayMoveCommand({ matchId, move: [alice, 6] }),
    ],
    expected: success({
      id: matchId,
      owner: alice,
      state: {
        kind: "Victory",
        winner: [alice, [0, 3, 6]],
        moves: [
          [alice, 0],
          [bob, 1],
          [alice, 3],
          [bob, 4],
          [alice, 6],
        ],
        players: [alice, bob],
      },
    }),
  },
  {
    name: "alice creates a match and draws",
    initialState: {},
    commands: [
      new JoinGameCommand({ player: alice }),
      new PlayMoveCommand({ matchId, move: [alice, 0] }),
      new JoinGameCommand({ player: bob }),
      new PlayMoveCommand({ matchId, move: [bob, 3] }),
      new PlayMoveCommand({ matchId, move: [alice, 6] }),
      new PlayMoveCommand({ matchId, move: [bob, 4] }),
      new PlayMoveCommand({ matchId, move: [alice, 1] }),
      new PlayMoveCommand({ matchId, move: [bob, 2] }),
      new PlayMoveCommand({ matchId, move: [alice, 5] }),
      new PlayMoveCommand({ matchId, move: [bob, 7] }),
      new PlayMoveCommand({ matchId, move: [alice, 8] }),
    ],
    expected: success({
      id: matchId,
      owner: alice,
      state: {
        kind: "Draw",
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
        players: [alice, bob],
      },
    }),
  },
];

const executeCommands = async (
  commands: Command[],
  lastResult: Result<Match, DomainError[]> = failure([new ZeroError()])
): AsyncDomainResult<Match> => {
  const [command, ...otherCommands] = commands;
  if (command === undefined) {
    return lastResult;
  }
  const result = await runPipeline(command);
  return executeCommands(otherCommands, result);
};

describe.each(scenarios)("run pipeline", (scenario) => {
  const { name, commands, initialState, expected } = scenario;

  let actual: DomainResult<Match>;

  beforeEach(async () => {
    setupScenario(initialState);
    actual = await executeCommands(commands);
  });

  it(name, () => {
    expect(actual).toEqual(expected);
  });
});
