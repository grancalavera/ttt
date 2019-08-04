import { DataSource, DataSourceConfig } from "apollo-datasource";

import { assertNever } from "../common";
import { Context, LOGGED_IN, LOGGED_OUT } from "../environment";
import { Avatar, Game, User, GameState, Player } from "../generated/models";
import { GameStateKindMap } from "../model";
import { GameModel, PlayerModel, UserModel } from "../store";

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

export class GameStore extends DataSource<Context> {
  private context!: Context;

  initialize({ context }: DataSourceConfig<Context>) {
    this.context = context;
  }

  private async createPlayer(userId: number, avatar: Avatar): Promise<PlayerModel> {
    const user = await UserModel.findByPk(userId);
    const player = await PlayerModel.create({ avatar: avatar.valueOf() });
    await player.setUser(user!);
    return player;
  }

  async getAllGames(): Promise<GameModel[]> {
    const games = await GameModel.findAll();
    return games;
  }

  async createGame(id: string, userId: number, avatar: Avatar): Promise<Game> {
    const player = await this.createPlayer(userId, avatar);
    const game = await GameModel.create({ state: GameStateKindMap.GameLobby });
    return {
      state: {
        __typename: game.state
      }
    } as Game;
  }

  async findOrCreateUser(email: string): Promise<User> {
    const { userStatus } = this.context;
    switch (userStatus.kind) {
      case LOGGED_IN:
        return userStatus.user;
      case LOGGED_OUT:
        const [userModel] = await UserModel.findOrCreate({ where: { email } });
        return {
          id: userModel.id.toString(),
          email: userModel.email
        };
      default:
        return assertNever(userStatus);
    }
  }
}
