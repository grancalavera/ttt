import { DataSource, DataSourceConfig } from "apollo-datasource";
import { RESTDataSource } from "apollo-datasource-rest";

import { Context } from "../environment";
import { User, Game } from "../generated/models";
import { GameModel, GameModelLobby, UserModel, GameModelPlaying } from "../store";

export class GameDS extends RESTDataSource {
  initialize(config: DataSourceConfig<Context>): void {
    super.initialize(config);
    this.baseURL = config.context.gameAPIBaseURL;
  }
}

export class GameDataSource extends DataSource {
  private context!: Context;

  initialize(config: DataSourceConfig<Context>) {
    this.context = config.context;
  }

  async joinGame(user: User): Promise<Game> {
    const firstGameInLobby = await GameModel.findOne({
      where: { status: GameModelLobby }
    });
    if (firstGameInLobby) {
      const model = await this.joinExistingGame(user, firstGameInLobby);
      const game: Game = {
        id: model.id.toString(),
        state: {
          __typename: "GamePlaying",
          oPlayer: {},
          xPlayer: {},
          moves: []
        }
      };
      return {} as Game;
    } else {
      return {} as Game;
    }
  }

  private async joinExistingGame(user: User, game: GameModel): Promise<GameModel> {
    const userModel = await UserModel.findOne({ where: { email: user.email } });
    if (userModel) {
      let update: Partial<GameModel> = { status: GameModelPlaying };
      if (game.xPlayer) {
        update = { oPlayer: userModel, ...update };
      } else if (game.oPlayer) {
        update = { xPlayer: userModel, ...update };
      } else {
        throw new Error(`invalid GameLobby: game ${game.id} does not have any players`);
      }
      return await game.update(update);
    } else {
      throw new Error(`user ${user.email} does not exist`);
    }
  }

  private async joinNewGame(user: User): Promise<GameModel> {
    return {} as GameModel;
  }
}
