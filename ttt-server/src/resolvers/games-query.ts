import { zip } from "lodash";

import { TTTDataSources } from "../environment";
import { Game, Player, Avatar, User } from "../generated/models";
import { GameStateKindMap } from "../model";
import { assertNever } from "../common";
import { PlayerModel, UserModel } from "../store";

const userFromModel = (userModel: UserModel): User => {
  return {
    email: userModel.email,
    id: userModel.id.toString()
  };
};

const playerFromModel = (playerModel: PlayerModel): Player => {
  return {
    avatar: playerModel.avatar as Avatar,
    user: userFromModel(playerModel.user!)
  };
};

export const getAllGames = async (dataSources: TTTDataSources): Promise<Game[]> => {
  const apiGames = await dataSources.gameAPI.getAllGames();
  const storeGames = await dataSources.gameStore.getAllGames();

  const games: Game[] = zip(apiGames, storeGames).map(([apiGame, storeGame]) => {
    if (apiGame && storeGame) {
      switch (storeGame.state) {
        case GameStateKindMap.GameLobby:
          return {} as Game;
        case GameStateKindMap.GamePlaying:
          return {} as Game;
        case GameStateKindMap.GameOverTie:
          return {} as Game;
        case GameStateKindMap.GameOverWin:
          return {} as Game;
        default:
          return assertNever(storeGame.state);
      }
    } else {
      throw new Error("Missing apiGame or storeGame in response");
    }
  });
  return games;
};
