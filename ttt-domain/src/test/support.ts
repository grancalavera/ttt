import { failure, Result, success } from "@grancalavera/ttt-etc";
import {
  CountActiveMatches,
  GameSettings,
  GetUniqueId,
  UpsertMatch,
} from "../dependencies";
import { DomainError, UpsertFailedError } from "../domain/error";
import { Match, Player } from "../domain/model";
import { RunWorkflow } from "../workflow/support";

export interface WorkflowScenario<Input> {
  name: string;
  runWorkflow: RunWorkflow<Input>;
  input: Input;
  expected: Result<Match, DomainError[]>;
}

export const alice: Player = { id: "alice" };
export const bob: Player = { id: "bob" };
export const illegalPlayer: Player = { id: "illegal-player" };
export const matchId = "match-id";

const upsertError = (m: Match) => new UpsertFailedError(m, "mock upsert failure");
export const upsertFailure = (m: Match) => failure([upsertError(m)]);

// prettier-ignore
type Dependencies =
  & CountActiveMatches
  & GetUniqueId
  & UpsertMatch
  & GameSettings;

interface Mocks {
  matchToUpsertFail?: Match;
  spyOnUpsert?: jest.Mock;
  activeMatches?: number;
  maxActiveMatches?: number;
}

export const mockWorkflowDependencies = (mocks: Mocks = {}): Dependencies => ({
  gameSize: 3 * 3,
  maxActiveMatches: mocks.maxActiveMatches ?? Number.POSITIVE_INFINITY,
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
