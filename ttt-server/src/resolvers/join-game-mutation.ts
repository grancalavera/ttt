import uuid from "uuid/v4";

import { User, Game, Avatar } from "../generated/models";
import { TTTDataSources } from "../environment";
import { chooseAvatar } from "../common";

export const joinGame = async (user: User, dataSources: TTTDataSources): Promise<Game> =>
  joinNewGame(uuid(), user, chooseAvatar(), dataSources);

export const joinNewGame = async (
  id: string,
  user: User,
  avatar: Avatar,
  dataSources: TTTDataSources
): Promise<Game> => {
  const userId = parseInt(user.id);
  await dataSources.gameAPI.postGame(id);
  const game = await dataSources.gameStore.createGame(id, userId, avatar);
  return game;
};
