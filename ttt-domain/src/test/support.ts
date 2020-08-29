import { failure, Result, success } from "@grancalavera/ttt-etc";
import { GameSettings, Match, Player } from "../domain/model";
import {
  CountActiveMatches,
  FindMatch,
  GetUniqueId,
  UpsertMatch,
} from "../workflows/support";
import {
  MatchNotFoundError,
  UpsertFailedError,
  WorkflowError,
} from "../workflows/workflow-error";

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
  // Domain
  & GameSettings
  // workflow support
  & CountActiveMatches
  & FindMatch
  & GetUniqueId
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
