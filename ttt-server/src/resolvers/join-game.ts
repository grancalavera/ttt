import uuid from "uuid/v4";
import { TTTContext } from "../environment";
import { JoinGameResult, Token, User } from "../generated/models";
import { pubsub, PUBSUB_GAME_ADDED, PUBSUB_GAME_CHANGED } from "../pubsub";

export const joinGame = async (
  user: User,
  context: TTTContext
): Promise<JoinGameResult> => {
  const { gameStore } = context.dataSources;
  const userId = user.id;
  const partialGame = await gameStore.findFirstPartialGame();

  if (partialGame) {
    await gameStore.joinGame(partialGame, userId, Token.X);
    pubsub.publish(PUBSUB_GAME_CHANGED, { gameChanged: partialGame });
    return { gameId: partialGame.id, token: Token.X };
  } else {
    const game = await gameStore.createGame(uuid(), userId);
    pubsub.publish(PUBSUB_GAME_ADDED, { gameAdded: game });
    return { gameId: game.id, token: Token.O };
  }
};
