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

export const joinGame = async (
  user: User,
  context: TTTContext
): Promise<JoinGameResult> => {
  const userId = parseInt(user.id);
  const { gameStore } = context.dataSources;

  const maybeGameInLobby = await gameStore.firstGameInLobby(userId);
  if (maybeGameInLobby) {
    return joinExistingGame(maybeGameInLobby, user, context);
  } else {
    return joinNewGame(uuid(), user, chooseAvatar(), context);
  }
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
  return gameInLobby(storeGame);
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
    return gamePlaying(coreGame, storeGame);
  } else {
    throw new Error(`unexpected CoreGame kind "${coreGame.kind}"`);
  }
};
