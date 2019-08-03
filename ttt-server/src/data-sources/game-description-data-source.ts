import { DataSource, DataSourceConfig } from "apollo-datasource";
import { nextPlayer } from "@grancalavera/ttt-core";

import { Context } from "../environment";
import { User, Avatar } from "../generated/models";
import { GameModel } from "../store";
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

  create(id: string, user: User, avatar: Avatar) {
    const status = GameStateKindMap.GameLobby;
    const waitingInLobby = nextPlayer([]);
    const oPlayer = avatar === Avatar.O ? "o" : null;
    const xPlayer = avatar === Avatar.X ? "x" : null;
    return GameModel.create({ id, status, waitingInLobby, oPlayer, xPlayer });
  }
}
