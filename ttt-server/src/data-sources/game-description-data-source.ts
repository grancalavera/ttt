import { DataSource, DataSourceConfig } from "apollo-datasource";
import uuid from "uuid/v4";
import { nextPlayer } from "@grancalavera/ttt-core";

import { Context } from "../environment";
import { User, Avatar } from "../generated/models";
import { GameModel, GameModelLobby } from "../store";

export class GameDescriptionDataSource extends DataSource {
  private context!: Context;

  initialize({ context }: DataSourceConfig<Context>) {
    this.context = context;
  }

  findById(id: string) {
    return GameModel.findOne({ where: { id } });
  }

  findFirstInLobby() {
    return GameModel.findOne({ where: { status: GameModelLobby } });
  }

  create(id: string, user: User, avatar: Avatar) {
    const status = GameModelLobby;
    const waitingInLobby = nextPlayer([]);
    const oPlayer = avatar === Avatar.O ? "o" : null;
    const xPlayer = avatar === Avatar.X ? "x" : null;
    return GameModel.create({ id, status, waitingInLobby, oPlayer, xPlayer });
  }
}
