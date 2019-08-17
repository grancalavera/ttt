import uuid from "uuid/v4";

import { chooseAvatar, isCoreGamePlaying } from "../common";
import { TTTContext } from "../environment";
import {
  Avatar,
  GameLobby,
  GamePlaying,
  JoinGameResult,
  User
} from "../generated/models";
import { GameModel } from "../store";
import { gameInLobby, gamePlaying } from "./combine-games";
import { PUBSUB_GAME_CHANGED, pubsub, PUBSUB_GAME_ADDED } from "../pubsub";

export const joinGame = async (
  user: User,
  context: TTTContext
): Promise<JoinGameResult> => {
  const userId = parseInt(user.id);
  const { gameStore } = context.dataSources;

  const maybeGameInLobby = await gameStore.firstGameInLobby(userId);
  const game = maybeGameInLobby
    ? await joinExistingGame(maybeGameInLobby, user, context)
    : await joinNewGame(uuid(), user, chooseAvatar(), context);
  return game;
};

const joinNewGame = async (
  id: string,
  user: User,
  avatar: Avatar,
  context: TTTContext
): Promise<GameLobby> => {
  const userId = parseInt(user.id);
  const { gameStore, gameAPI } = context.dataSources;

  await gameAPI.postGame(id);
  const storeGame = await gameStore.createGame(id, userId, avatar);
  const gameAdded = gameInLobby(storeGame);

  pubsub.publish(PUBSUB_GAME_ADDED, { gameAdded });
  return gameAdded;
};

const joinExistingGame = async (
  game: GameModel,
  user: User,
  context: TTTContext
): Promise<GamePlaying> => {
  const { gameStore, gameAPI } = context.dataSources;
  const userId = parseInt(user.id);

  const storeGame = await gameStore.joinGame(game, userId);
  const { game: coreGame } = await gameAPI.getGameById(game.id);

  if (isCoreGamePlaying(coreGame)) {
    const gameChanged = gamePlaying(coreGame, storeGame);

    pubsub.publish(PUBSUB_GAME_CHANGED, { gameChanged });
    return gameChanged;
  } else {
    throw new Error(`unexpected CoreGame kind "${coreGame.kind}"`);
  }
};
