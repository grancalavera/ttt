import { failure, Result, success } from "@grancalavera/ttt-etc";
import { GameSettings, Match, Player } from "../domain/model";
import {
  CountActiveMatches,
  FindMatch,
  GetUniqueId,
  RunWorkflow,
  UpsertMatch,
} from "../workflow/support";
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
export const illegalPlayer: Player = { id: "illegalPlayer" };
export const matchId = "default-match-id";
export const getUniqueId = () => matchId;

export const upsertError = (m: Match) => new UpsertFailedError(m, "mock upsert failure");
export const upsertFailure = (m: Match) => failure([upsertError(m)]);

const gameSize = 3 * 3;

// prettier-ignore
type Dependencies =
  // Domain
  & GameSettings
  // workflow support
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
  gameSize,
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
  getUniqueId,
});
