import uuid from "uuid/v4";

import {
  CORE_GAME_OVER_TIE,
  CORE_GAME_OVER_WIN,
  CORE_GAME_PLAYING,
  CoreGame
} from "@grancalavera/ttt-core";

import { assertNever, chooseAvatar } from "../common";
import { TTTDataSources } from "../environment";
import { Avatar, Game, GameLobby, Player, User, GamePlaying } from "../generated/models";
import { GameStateKind, GameStateKindMap, playerFromModel } from "../model";
import { GameModel, PlayerModel } from "../store";

export const joinGame = async (
  user: User,
  dataSources: TTTDataSources
): Promise<Game> => {
  const userId = parseInt(user.id);
  const maybeGameInLobby = await dataSources.gameStore.firstGameInLobby(userId);
  if (maybeGameInLobby) {
    return joinExistingGame(maybeGameInLobby, user, dataSources);
  } else {
    return joinNewGame(uuid(), user, chooseAvatar(), dataSources);
  }
};

const joinNewGame = async (
  id: string,
  user: User,
  avatar: Avatar,
  dataSources: TTTDataSources
): Promise<Game> => {
  const userId = parseInt(user.id);
  const { game: coreGame } = await dataSources.gameAPI.postGame(id);
  const storeGame = await dataSources.gameStore.createGame(id, userId, avatar);

  return combineGames(coreGame, storeGame);
};

const joinExistingGame = async (
  game: GameModel,
  user: User,
  dataSources: TTTDataSources
): Promise<Game> => {
  const userId = parseInt(user.id);
  const storeGame = await dataSources.gameStore.joinGame(game, userId);
  const { game: coreGame } = await dataSources.gameAPI.getGameById(game.id);
  return combineGames(coreGame, storeGame);
};

export const combineGames = (coreGame: CoreGame, storeGame: GameModel): Game => {
  const id = storeGame.id;

  if (storeGame.isInLobby) {
    return {
      id,
      state: {
        __typename: GameStateKindMap.GameLobby,
        waiting: resolveWaitingPlayer(storeGame)
      }
    };
  }
  switch (coreGame.kind) {
    case CORE_GAME_PLAYING:
      return {} as Game;
    case CORE_GAME_OVER_TIE:
      return {} as Game;
    case CORE_GAME_OVER_WIN:
      return {} as Game;
    default:
      return assertNever(coreGame);
  }
};

const resolveWaitingPlayer = (storeGame: GameModel): Player => {
  if (storeGame.playerO) {
    return playerFromModel(storeGame.playerO);
  } else if (storeGame.playerX) {
    return playerFromModel(storeGame.playerX);
  } else {
    throw new Error("Illegal game: a game must have at least one player");
  }
};
