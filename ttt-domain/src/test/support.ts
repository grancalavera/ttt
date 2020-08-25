import { failure, success } from "@grancalavera/ttt-etc";
import { Match, Player, SystemConfig } from "../domain/model";
import {
  CountActiveMatches,
  FindMatch,
  GetUniqueId,
  MatchNotFoundError,
  UpsertMatch,
  WorkflowResult,
  UpsertFailedError,
} from "../workflows/support";

export const alice: Player = { id: "alice" };
export const bob: Player = { id: "bob" };
export const illegalPlayer: Player = { id: "illegalPlayer" };
export const matchId = "default-match-id";
export const getUniqueId = () => matchId;
export const maxActiveMatches = 1;

export const upsertFailure = failure(
  new UpsertFailedError(
    { id: matchId, owner: alice, state: { kind: "New" } },
    "mock upsert failure"
  )
);

const gameSize = 3 * 3;

// prettier-ignore
type Dependencies =
  & SystemConfig
  & CountActiveMatches
  & GetUniqueId
  & FindMatch
  & UpsertMatch;

interface Mocks {
  upsertResult?: WorkflowResult<void>;
  spyOnUpsert?: jest.Mock;
  findResult?: WorkflowResult<Match>;
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
