import uuid from "uuid/v4";

import { User, Game } from "../generated/models";
import { TTTDataSources } from "../environment";
import { chooseAvatar } from "../common";

export const joinGame = async (
  user: User,
  dataSources: TTTDataSources
): Promise<Game> => {
  const id = uuid();
  const avatar = chooseAvatar();
  const userId = parseInt(user.id);

  await dataSources.gameAPI.postGame(id);
  await dataSources.gameStore.createGame(id, userId, avatar);

  return Promise.resolve<Game>({
    id,
    state: {
      __typename: "GameLobby",
      waiting: { user, avatar }
    }
  });
};
