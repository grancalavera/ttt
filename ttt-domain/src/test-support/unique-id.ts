import { ChallengeId, GameId, UniqueIdProducer } from "model";

export const defaultGameId: GameId = "default-game-id";
export const defaultChallengeId: ChallengeId = "default-challenge-id";

export const gameUniqueIdProducer: UniqueIdProducer = {
  getUniqueId: () => defaultGameId,
};

export const challengeUniqueIdProducer: UniqueIdProducer = {
  getUniqueId: () => defaultChallengeId,
};
