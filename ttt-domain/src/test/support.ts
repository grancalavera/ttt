import { failure, Result, success } from "@grancalavera/ttt-etc";
import {
  CountActiveMatches,
  FindMatch,
  GameSettings,
  GetUniqueId,
  UpsertMatch,
} from "../dependencies";
import { Match, Player } from "../domain/model";
import { RunWorkflow } from "../workflow/support";
import {
  MatchNotFoundError,
  UpsertFailedError,
  WorkflowError,
} from "../workflow/workflow-error";

export interface WorkflowScenario<Input> {
  name: string;
  runWorkflow: RunWorkflow<Input>;
  input: Input;
  expected: Result<Match, WorkflowError[]>;
}

export const alice: Player = { id: "alice" };
export const bob: Player = { id: "bob" };
export const illegalPlayer: Player = { id: "illegal-player" };
export const matchId = "match-id";

const upsertError = (m: Match) => new UpsertFailedError(m, "mock upsert failure");
export const upsertFailure = (m: Match) => failure([upsertError(m)]);

// prettier-ignore
type Dependencies =
  // Domain
  & GameSettings
  // Workflow
  & CountActiveMatches
  & FindMatch
  & GetUniqueId
  & UpsertMatch;

interface Mocks {
  matchToUpsertFail?: Match;
  spyOnUpsert?: jest.Mock;
  matchToFind?: Match;
  spyOnFind?: jest.Mock;
  activeMatches?: number;
  maxActiveMatches?: number;
}

export const mockDependencies = (mocks: Mocks = {}): Dependencies => ({
  gameSize: 3 * 3,
  maxActiveMatches: mocks.maxActiveMatches ?? Number.POSITIVE_INFINITY,
  findMatch: async (ref) => {
    const { matchToFind } = mocks;
    mocks.spyOnFind && mocks.spyOnFind(ref);
    return matchToFind ? success(matchToFind) : failure(new MatchNotFoundError(matchId));
  },
  upsertMatch: async (match) => {
    const { matchToUpsertFail } = mocks;
    mocks.spyOnUpsert && mocks.spyOnUpsert(matchToUpsertFail ?? match);
    return matchToUpsertFail
      ? failure(upsertError(matchToUpsertFail))
      : success(undefined);
  },
  countActiveMatches: async () => mocks.activeMatches ?? 0,
  getUniqueId: () => matchId,
});
