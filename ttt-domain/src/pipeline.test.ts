import { failure, Result, success } from "@grancalavera/ttt-etc";
import { Command, JoinGameCommand } from "./command/support";
import {
  DomainError,
  MatchNotFoundError,
  NoChallengesFoundError,
  ZeroError,
} from "./domain/error";
import { Challenge, Match, MatchDescription } from "./domain/model";
import { AsyncDomainResult, DomainResult } from "./domain/result";
import { alice, bob, matchId } from "./test/support";
import { buildPipeline } from "./pipeline";

let activeMatches: number = 0;
let initialState: InitialState = {};

const spyOnFindMatch = jest.fn();
const spyOnFindFirstChallenge = jest.fn();
const spyOnCountActiveMatches = jest.fn();
const spyOnGetUniqueId = jest.fn();
const spyOnUpsertMatch = jest.fn();

interface InitialState {
  match?: Match;
  firstChallenge?: [MatchDescription, Challenge];
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
    spyOnFindMatch(id);
    const { match } = initialState;
    return match === undefined ? failure(new MatchNotFoundError(id)) : success(match);
  },
  findFirstChallenge: async () => {
    spyOnFindFirstChallenge();
    const { firstChallenge } = initialState;
    return firstChallenge === undefined
      ? failure(new NoChallengesFoundError())
      : success(firstChallenge);
  },
  countActiveMatches: async (player) => {
    spyOnCountActiveMatches(player);
    return activeMatches;
  },
  getUniqueId: () => {
    spyOnGetUniqueId();
    return matchId;
  },
  upsertMatch: async (match) => {
    spyOnUpsertMatch(match);
    initialState.match = match;
    return success(undefined);
  },
});

const setupScenario = (initial: InitialState) => {
  initialState = initial;
  activeMatches = 0;
  spyOnFindMatch.mockClear();
  spyOnFindFirstChallenge.mockClear();
  spyOnCountActiveMatches.mockClear();
  spyOnGetUniqueId.mockClear();
  spyOnUpsertMatch.mockClear();
};

const scenarios: Scenario[] = [
  {
    name: "join game: New",
    commands: [new JoinGameCommand({ player: alice })],
    initialState: {},
    expected: success({
      matchDescription: { id: matchId, owner: alice },
      matchState: { kind: "New" },
    }),
  },
  {
    name: "join game: Game",
    initialState: {
      firstChallenge: [
        { owner: alice, id: matchId },
        { kind: "Challenge", move: [alice, 0] },
      ],
    },
    expected: success({
      matchDescription: { id: matchId, owner: alice },
      matchState: {
        kind: "Game",
        players: [alice, bob],
        moves: [[alice, 0]],
        next: bob,
      },
    }),
    commands: [new JoinGameCommand({ player: bob })],
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
