import { DataSource, DataSourceConfig } from "apollo-datasource";

import { Context } from "../environment";
import { Avatar } from "../generated/models";
import { GameStateKindMap } from "../model";
import { GameModel, PlayerModel, UserModel } from "../store";

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
    return GameModel.findAll({ include: includePlayers });
  }

  async firstGameInLobby(): Promise<GameModel | null> {
    const game = await GameModel.findOne({
      where: { state: GameStateKindMap.GameLobby }
    });
    return game;
  }

  async createGame(id: string, userId: number, avatar: Avatar): Promise<GameModel> {
    const player = await this.createPlayer(userId, avatar);
    const game = await GameModel.create({ id, state: GameStateKindMap.GameLobby });
    if (avatar == Avatar.O) {
      await game.setPlayerO(player);
    } else {
      await game.setPlayerX(player);
    }
    return game;
  }

  async findOrCreateUser(email: string): Promise<UserModel> {
    const [userModel] = await UserModel.findOrCreate({ where: { email } });
    return userModel;
  }

  public async reloadPlayers(game: GameModel): Promise<GameModel> {
    return await game.reload({
      include: includePlayers
    });
  }
}

const includePlayer = (as: "playerO" | "playerX") => {
  return {
    model: PlayerModel,
    as,
    include: [{ model: UserModel, as: "user" }]
  };
};

const includePlayers = [includePlayer("playerO"), includePlayer("playerX")];
