import { DataSource, DataSourceConfig } from "apollo-datasource";
import { nextPlayer } from "@grancalavera/ttt-core";

import { Context } from "../environment";
import { User, Avatar } from "../generated/models";
import { GameModel, UserModel } from "../store";
import { GameStateKindMap } from "../model";

export class GameDescriptionDataSource extends DataSource {
  private context!: Context;

  initialize({ context }: DataSourceConfig<Context>) {
    this.context = context;
  }

  findById(id: string) {
    return GameModel.findOne({ where: { id } });
  }

  findFirstInLobby() {
    return GameModel.findOne({ where: { status: GameStateKindMap.GameLobby } });
  }

  async create(id: string, user: User, avatar: Avatar) {
    const [userModel] = await UserModel.findOrCreate({
      where: { email: user.email }
    });
    const status = GameStateKindMap.GameLobby;
    return GameModel.create({ id, status, waitingInLobby: userModel.id });
  }
}
