import uuid from "uuid/v4";

import {
  CORE_GAME_OVER_TIE,
  CORE_GAME_OVER_WIN,
  CORE_GAME_PLAYING,
  CoreGame,
  CoreMove,
  CorePlayer,
  CorePosition
} from "@grancalavera/ttt-core";

import { assertNever, chooseAvatar } from "../common";
import { TTTDataSources, Context } from "../environment";
import {
  Avatar,
  Game,
  Move,
  Player,
  Position,
  User,
  JoinGameResult
} from "../generated/models";
import { GameTypename, playerFromModel } from "../model";
import { GameModel } from "../store";

export const joinGame = async (user: User, context: Context): Promise<JoinGameResult> => {
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
  context: Context
): Promise<JoinGameResult> => {
  const userId = parseInt(user.id);
  const { gameStore, gameAPI } = context.dataSources;
  const { game: coreGame } = await gameAPI.postGame(id);
  const storeGame = await gameStore.createGame(id, userId, avatar);
  return combineGames(coreGame, storeGame);
};

const joinExistingGame = async (
  game: GameModel,
  user: User,
  context: Context
): Promise<JoinGameResult> => {
  const { gameStore, gameAPI } = context.dataSources;
  const userId = parseInt(user.id);
  const storeGame = await gameStore.joinGame(game, userId);
  const { game: coreGame } = await gameAPI.getGameById(game.id);
  return combineGames(coreGame, storeGame);
};

export const combineGames = (coreGame: CoreGame, storeGame: GameModel): Game => {
  const id = storeGame.id;

  if (storeGame.isInLobby) {
    return {
      id,
      __typename: GameTypename.GameLobby,
      waiting: resolveWaitingPlayer(storeGame)
    };
  }

  switch (coreGame.kind) {
    case CORE_GAME_PLAYING:
      return {
        id,
        __typename: GameTypename.GamePlaying,
        currentPlayer: corePlayerToPlayer(coreGame.currentPlayer, storeGame),
        moves: coreGame.moves.map(coreMoveToMove),
        oPlayer: playerFromModel(storeGame.playerO!),
        xPlayer: playerFromModel(storeGame.playerX!)
      };
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

const coreMoveToMove = ([player, position]: CoreMove): Move => ({
  position: corePositionToPosition(position),
  avatar: player === "O" ? Avatar.O : Avatar.X
});

const corePlayerToPlayer = (corePlayer: CorePlayer, storeGame: GameModel): Player =>
  playerFromModel(corePlayer === "O" ? storeGame.playerO! : storeGame.playerX!);

const corePositionToPosition = (position: CorePosition): Position =>
  [
    Position.A,
    Position.B,
    Position.C,
    Position.D,
    Position.E,
    Position.F,
    Position.G,
    Position.H,
    Position.I
  ][position];
