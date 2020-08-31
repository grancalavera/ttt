import { failure, Result, success } from "@grancalavera/ttt-etc";
import { CountActiveMatches } from "../command/support";
import { DomainError, UpsertFailedError } from "../domain/error";
import { Match, Player } from "../domain/model";
import { GameSettings } from "../system/support";
import { GetUniqueId, RunWorkflow, UpsertMatch } from "../workflow/support";

export interface WorkflowScenario<Input> {
  name: string;
  runWorkflow: RunWorkflow<Input>;
  input: Input;
  expectedMatch: Match;
  expectedResult: Result<Match, DomainError[]>;
}

export const alice: Player = { id: "alice" };
export const bob: Player = { id: "bob" };
export const illegalPlayer: Player = { id: "illegal-player" };
export const matchId = "match-id";

const upsertError = (m: Match) => new UpsertFailedError(m, "mock upsert failure");
export const upsertFailure = (m: Match) => failure([upsertError(m)]);

type SystemDependencies = GameSettings;
type WorkflowDependencies = GetUniqueId & UpsertMatch;
type CommandDependencies = CountActiveMatches;
// really should be:
// type CommandDependencies = CountActiveMatches & FindFirstChallenge & FindMatch;

interface SystemMocks {
  readonly maxActiveMatches?: number;
}

interface WorkflowMocks {
  readonly matchToUpsertFail?: Match;
  readonly spyOnUpsert?: jest.Mock;
}

interface CommandMocks {
  activeMatches?: number;
}

const mockSystemDependencies = (mocks: SystemMocks = {}): SystemDependencies => ({
  gameSize: 3 * 3,
  maxActiveMatches: mocks.maxActiveMatches ?? Number.POSITIVE_INFINITY,
});

export const mockWorkflowDependencies = (
  mocks: SystemMocks & WorkflowMocks = {}
): SystemDependencies & WorkflowDependencies => ({
  ...mockSystemDependencies(mocks),
  upsertMatch: async (match) => {
    const { matchToUpsertFail } = mocks;
    mocks.spyOnUpsert && mocks.spyOnUpsert(matchToUpsertFail ?? match);
    return matchToUpsertFail
      ? failure(upsertError(matchToUpsertFail))
      : success(undefined);
  },
  getUniqueId: () => matchId,
});

export const mockCommandDependencies = (
  mocks: SystemMocks & CommandMocks = {}
): SystemDependencies & CommandDependencies => ({
  ...mockSystemDependencies(mocks),
  countActiveMatches: async () => mocks.activeMatches ?? 0,
});
