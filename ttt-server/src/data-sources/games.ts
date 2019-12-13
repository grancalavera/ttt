import { DataSource, DataSourceConfig } from "apollo-datasource";
import { DataSourceContext } from "context";
import { Game } from "entity/game";
import { User } from "entity/user";
import uuid = require("uuid");
import { Token } from "generated/graphql";
import { Not } from "typeorm";

export class GamesDataSource extends DataSource {
  private context!: DataSourceContext;

  initialize(config: DataSourceConfig<DataSourceContext>) {
    this.context = config.context;
  }

  async findOpenGameForUser(user: User): Promise<Game | undefined> {
    const game = await Game.findOne({ where: { X: null, O: Not(user.id) } });
    return game;
  }

  async findGamesForUser(user: User) {
    const games = await Game.find({ where: [{ O: user.id }, { X: user.id }] });
    return games;
  }

  async joinNewGame(user: User, token: Token) {
    const game = new Game();
    game.id = uuid();
    game[token] = user.id;
    game.next = token;
    await game.save();
    return game;
  }

  async joinExistingGame(game: Game, user: User, token: Token) {
    game[token] = user.id;
    await game.save();
    return game;
  }
}
