import { ChallengeId, GameId, UniqueIdProducer } from "model";

export const defaultGameId: GameId = "default-game-id";
export const defaultChallengeId: ChallengeId = "default-challenge-id";

export const gameUniqueIdProducerMock: UniqueIdProducer = {
  getUniqueId: () => defaultGameId,
};

export const challengeUniqueIdProducerMock: UniqueIdProducer = {
  getUniqueId: () => defaultChallengeId,
};
