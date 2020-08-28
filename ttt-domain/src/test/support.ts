import { failure, Result, success, NonEmptyArray } from "@grancalavera/ttt-etc";
import { Match, Player, GameSettings } from "../domain/model";
import { WorkflowError } from "../workflows/workflow-error";
import {
  CountActiveMatches,
  FindMatch,
  GetUniqueId,
  MatchNotFoundError,
  UpsertFailedError,
  UpsertMatch,
} from "../workflows/support";

export const alice: Player = { id: "alice" };
export const bob: Player = { id: "bob" };
export const illegalPlayer: Player = { id: "illegalPlayer" };
export const matchId = "default-match-id";
export const getUniqueId = () => matchId;
export const maxActiveMatches = 1;

export const upsertError = new UpsertFailedError(
  { id: matchId, owner: alice, state: { kind: "New" } },
  "mock upsert failure"
);

export const upsertFailure = failure(upsertError);

const gameSize = 3 * 3;

// prettier-ignore
type Dependencies =
  & GameSettings
  & CountActiveMatches
  & GetUniqueId
  & FindMatch
  & UpsertMatch;

interface Mocks {
  upsertResult?: Result<void, WorkflowError>;
  spyOnUpsert?: jest.Mock;
  findResult?: Result<Match, WorkflowError>;
  spyOnFind?: jest.Mock;
  activeMatches?: number;
}

export const mockDependencies = (mocks: Mocks = {}): Dependencies => ({
  gameSize,
  maxActiveMatches,
  findMatch: async (ref) => {
    mocks.spyOnFind && mocks.spyOnFind(ref);
    return mocks.findResult ?? failure(new MatchNotFoundError(matchId));
  },
  upsertMatch: async (match) => {
    mocks.spyOnUpsert && mocks.spyOnUpsert(match);
    return mocks.upsertResult ?? success(undefined);
  },
  countActiveMatches: async () => mocks.activeMatches ?? 0,
  getUniqueId,
});

export const hasErrorKind = (errors: WorkflowError[]) => (
  ...kinds: NonEmptyArray<WorkflowError["kind"]>
) => errors.some((e) => kinds.includes(e.kind));
