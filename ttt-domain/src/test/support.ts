import { Player, Challenger, Opponent } from "../domain/model";
import { ChallengeId, GameId } from "../domain/model";
import { UniqueIdProducer } from "../workflows/support";

export const alice: Player = { playerId: "alice" };
export const bob: Player = { playerId: "bob" };
export const illegalPlayer: Player = { playerId: "illegalPlayer" };

export const toChallenger = ({ playerId }: Player): Challenger => ({
  challengerId: playerId,
});

export const toOpponent = ({ playerId }: Player): Opponent => ({
  opponentId: playerId,
});

export const narrowScenarios = <T extends unknown>(scenarios: T[]) => (
  start?: number,
  end?: number
): T[] => (start === undefined ? scenarios : scenarios.slice(start, end));

export const defaultGameId: GameId = "default-game-id";
export const defaultChallengeId: ChallengeId = "default-challenge-id";

export const gameUniqueIdProducer: UniqueIdProducer = {
  getUniqueId: () => defaultGameId,
};

export const challengeUniqueIdProducer: UniqueIdProducer = {
  getUniqueId: () => defaultChallengeId,
};
