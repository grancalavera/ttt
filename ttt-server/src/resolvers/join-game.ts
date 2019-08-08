import uuid from "uuid/v4";

import {
  CORE_GAME_OVER_TIE,
  CORE_GAME_OVER_WIN,
  CORE_GAME_PLAYING,
  CoreGame
} from "@grancalavera/ttt-core";

import { assertNever, chooseAvatar } from "../common";
import { TTTDataSources } from "../environment";
import { Avatar, Game, GameLobby, Player, User } from "../generated/models";
import { GameStateKind, GameStateKindMap, playerFromModel } from "../model";
import { GameModel, PlayerModel } from "../store";

export const joinGame = async (user: User, dataSources: TTTDataSources): Promise<Game> =>
  joinNewGame(uuid(), user, chooseAvatar(), dataSources);

export const joinNewGame = async (
  id: string,
  user: User,
  avatar: Avatar,
  dataSources: TTTDataSources
): Promise<Game> => {
  const userId = parseInt(user.id);
  const { game: coreGame } = await dataSources.gameAPI.postGame(id);
  const storeGame = await dataSources.gameStore.createGame(id, userId, avatar);
  await dataSources.gameStore.reloadPlayers(storeGame);
  return combineGames(coreGame, storeGame);
};

export const combineGames = (coreGame: CoreGame, storeGame: GameModel): Game => {
  const id = storeGame.id;
  const __typename = resolveTypename(coreGame, storeGame.playerO, storeGame.playerX);

  switch (__typename) {
    case GameStateKindMap.GameLobby:
      const state: GameLobby = {
        __typename,
        waiting: resolveWaitingPlayer(storeGame)
      };
      return {
        id,
        state
      };
    case GameStateKindMap.GamePlaying:
      return {} as Game;
    case GameStateKindMap.GameOverTie:
      return {} as Game;
    case GameStateKindMap.GameOverWin:
      return {} as Game;
    default:
      return assertNever(__typename);
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

const resolveTypename = (
  coreGame: CoreGame,
  player1?: PlayerModel,
  player2?: PlayerModel
): GameStateKind => {
  if (!player1 && !player2) {
    throw new Error(`Illegal game: a game must have at least one player.
Did you forget to call "gameStore.reloadPlayers(storeGame)"?`);
  }

  if (!player1 || !player2) {
    return GameStateKindMap.GameLobby;
  }

  switch (coreGame.kind) {
    case CORE_GAME_PLAYING:
      return GameStateKindMap.GamePlaying;
    case CORE_GAME_OVER_TIE:
      return GameStateKindMap.GameOverTie;
    case CORE_GAME_OVER_WIN:
      return GameStateKindMap.GameOverWin;
    default:
      return assertNever(coreGame);
  }
};
