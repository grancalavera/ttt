import { MatchId, Player } from "../domain/model";
import { GetUniqueId } from "../workflows/support";

export const alice: Player = { id: "alice" };
export const bob: Player = { id: "bob" };
export const illegalPlayer: Player = { id: "illegalPlayer" };

export const narrowScenarios = <T extends unknown>(scenarios: T[]) => (
  start?: number,
  end?: number
): T[] => (start === undefined ? scenarios : scenarios.slice(start, end));

export const defaultMatchId: MatchId = "default-match-id";

export const getMatchUniqueId: GetUniqueId = {
  getUniqueId: () => defaultMatchId,
};
