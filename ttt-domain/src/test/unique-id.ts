import { UniqueIdProducer, GameId } from "model";
export const defaultGameId: GameId = "default-game-id";
export const uniqueIdProducerMock: UniqueIdProducer = {
  getUniqueId: () => defaultGameId,
};
