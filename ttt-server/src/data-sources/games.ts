import { DataSource, DataSourceConfig } from "apollo-datasource";
import { TTTContext } from "context";
import { User } from "entity/user";
import { Game } from "entity/game";
import uuid = require("uuid");

export class GamesDataSource extends DataSource {
  private context!: TTTContext;

  initialize(config: DataSourceConfig<TTTContext>) {
    this.context = config.context;
  }

  async create(user: User) {
    const game = new Game();
    game.id = uuid();
    game.oId = user.id;
    await game.save();
    return game;
  }

  async join(gameId: string, user: User) {
    const game = await Game.findOneOrFail({ where: { id: gameId } });
    game.xId = user.id;
    await game.save();
    return game;
  }
}
