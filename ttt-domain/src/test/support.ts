import { Match, Player } from "../domain/model";
import { CreateMatchDependencies } from "../workflows/create-match/workflow";
import { StandardDependencies, WorkflowResult, FindMatch } from "../workflows/support";

export const alice: Player = { id: "alice" };
export const bob: Player = { id: "bob" };
export const illegalPlayer: Player = { id: "illegalPlayer" };
export const matchId = "default-match-id";
export const getUniqueId = () => matchId;
export const maxActiveMatches = 1;
const gameSize = 3 * 3;

interface UpsertMock {
  upsertResult: WorkflowResult<void>;
  spyOnUpsert: jest.Mock;
}

interface FindMock {
  findResult: WorkflowResult<Match>;
  spyOnFind: jest.Mock;
}

export const standardDependencies = (
  mocks: FindMock & UpsertMock
): StandardDependencies => ({
  gameSize,
  maxActiveMatches,
  findMatch: async (ref) => {
    mocks.spyOnFind(ref);
    return mocks.findResult;
  },
  upsertMatch: async (match) => {
    mocks.spyOnUpsert(match);
    return mocks.upsertResult;
  },
});

export const createMatchDependencies = (mocks: UpsertMock): CreateMatchDependencies => ({
  gameSize,
  maxActiveMatches,
  getUniqueId,
  countActiveMatches: async (player) => (player.id === bob.id ? 1 : 0),
  upsertMatch: async (match) => {
    mocks.spyOnUpsert(match);
    return mocks.upsertResult;
  },
});
