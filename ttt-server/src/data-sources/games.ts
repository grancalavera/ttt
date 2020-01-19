import { DataSource, DataSourceConfig } from "apollo-datasource";
import { DataSourceContext } from "context";
import { GameEntity } from "entity/game-entity";
import { UserEntity } from "entity/user-entity";
import { Token } from "generated/graphql";
import { Not } from "typeorm";
import uuid = require("uuid");

export class GamesDataSource extends DataSource {
  private context!: DataSourceContext;

  initialize(config: DataSourceConfig<DataSourceContext>) {
    this.context = config.context;
  }

  async findOpenGameForUser(user: UserEntity): Promise<GameEntity | undefined> {
    const game = await GameEntity.findOne({
      where: { X: null, O: Not(user.id) },
    });
    return game;
  }

  async findGameOwnedByUser(gameId: string, userEntity: UserEntity) {
    const gameEntity = await GameEntity.findOne({
      where: [
        { O: userEntity.id, id: gameId },
        { X: userEntity.id, id: gameId },
      ],
    });

    if (!gameEntity) {
      throw new Error(`
Invalid query:
either game ${gameId} does not exist or user ${userEntity.id} is not authorized to see it.`);
    }

    return gameEntity;
  }

  async findGamesForUser(user: UserEntity) {
    const games = await GameEntity.find({
      where: [{ O: user.id }, { X: user.id }],
    });
    return games;
  }

  async joinNewGame(user: UserEntity, token: Token) {
    const game = new GameEntity();
    game.id = uuid();
    game.status = "GamePlaying";
    game[token] = user.id;
    game.next = token;
    await game.save();
    return game;
  }

  async joinExistingGame(game: GameEntity, user: UserEntity, token: Token) {
    game[token] = user.id;
    await game.save();
    return game;
  }
}
