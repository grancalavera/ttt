import { DataSource, DataSourceConfig } from "apollo-datasource";
import uuid from "uuid/v4";
import { nextPlayer } from "@grancalavera/ttt-core";

import { Context } from "../environment";
import { User, Avatar } from "../generated/models";
import { GameModel } from "../store";
import { GAME_LOBBY } from "../model";

export class GameDescriptionDataSource extends DataSource {
  private context!: Context;

  initialize({ context }: DataSourceConfig<Context>) {
    this.context = context;
  }

  findById(id: string) {
    return GameModel.findOne({ where: { id } });
  }

  findFirstInLobby() {
    return GameModel.findOne({ where: { status: GAME_LOBBY } });
  }

  create(id: string, user: User, avatar: Avatar) {
    const status = GAME_LOBBY;
    const waitingInLobby = nextPlayer([]);
    const oPlayer = avatar === Avatar.O ? "o" : null;
    const xPlayer = avatar === Avatar.X ? "x" : null;
    return GameModel.create({ id, status, waitingInLobby, oPlayer, xPlayer });
  }
}
