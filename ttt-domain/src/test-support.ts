import { failure, Result, success } from "@grancalavera/ttt-etc";
import {
  CountActiveMatches,
  FindMatch,
  FindFirstChallenge,
  Command,
  HandleCommand,
} from "./command/support";
import {
  DomainError,
  UpsertFailedError,
  NoChallengesFoundError,
  MatchNotFoundError,
} from "./domain/error";
import { Match, Player, MatchDescription, Challenge } from "./domain/model";
import { GameSettings } from "./system/support";
import { GetUniqueId, RunWorkflow, UpsertMatch, WorkflowInput } from "./workflow/support";
import { DomainResult } from "./domain/result";

export interface WorkflowScenario<Input> {
  name: string;
  runWorkflow: RunWorkflow<Input>;
  input: Input;
  expectedResult: Result<Match, DomainError[]>;
  expectedMatch?: Match;
}

export interface CommandScenario<TCommand extends Command> {
  name: string;
  handleCommand: HandleCommand<TCommand>;
  command: TCommand;
  expected: DomainResult<WorkflowInput>;
}

export const alice: Player = { id: "alice" };
export const bob: Player = { id: "bob" };
export const unknownPlayer: Player = { id: "unknown-player" };
export const matchId = "match-id";

const upsertError = (m: Match) => new UpsertFailedError(m);
export const upsertFailure = (m: Match) => failure([upsertError(m)]);

type SystemDependencies = GameSettings;
type WorkflowDependencies = GetUniqueId & UpsertMatch;
type CommandDependencies = CountActiveMatches & FindFirstChallenge & FindMatch;

interface SystemMocks {
  readonly maxActiveMatches?: number;
}

interface WorkflowSpies {
  readonly spyOnUpsert: jest.Mock;
}

interface WorkflowMocks {
  readonly upsertFails?: boolean;
}

interface CommandSpies {
  readonly spyOnFindFirstChallenge?: jest.Mock;
  readonly spyOnFindMatch?: jest.Mock;
  readonly spyOnCountActiveMatches?: jest.Mock;
}

interface CommandMocks {
  activeMatches?: number;
  firstChallengeToFind?: [MatchDescription, Challenge];
  matchToFind?: Match;
}

const mockSystemDependencies = (mocks: SystemMocks = {}): SystemDependencies => ({
  gameSize: 3,
  maxActiveMatches: mocks.maxActiveMatches ?? Number.POSITIVE_INFINITY,
  maxMoves: 3 * 3,
});

export const mockWorkflowDependencies = (spies: WorkflowSpies) => (
  mocks: SystemMocks & WorkflowMocks = {}
): SystemDependencies & WorkflowDependencies => ({
  ...mockSystemDependencies(mocks),

  getUniqueId: () => matchId,

  upsertMatch: async (match) => {
    spies.spyOnUpsert(match);
    return mocks.upsertFails ? failure(upsertError(match)) : success(undefined);
  },
});

export const mockCommandDependencies = (spies: CommandSpies) => (
  mocks: SystemMocks & CommandMocks = {}
): SystemDependencies & CommandDependencies => {
  const { spyOnFindFirstChallenge, spyOnFindMatch, spyOnCountActiveMatches } = spies;

  return {
    ...mockSystemDependencies(mocks),

    countActiveMatches: async () => {
      spyOnCountActiveMatches && spyOnCountActiveMatches();
      return mocks.activeMatches ?? 0;
    },

    findFirstChallenge: async () => {
      spyOnFindFirstChallenge && spyOnFindFirstChallenge();
      return mocks.firstChallengeToFind
        ? success(mocks.firstChallengeToFind)
        : failure(new NoChallengesFoundError());
    },

    findMatch: async (id) => {
      spyOnFindMatch && spyOnFindMatch(id);
      return mocks.matchToFind
        ? success(mocks.matchToFind)
        : failure(new MatchNotFoundError(id));
    },
  };
};
