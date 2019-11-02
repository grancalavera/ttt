import { DataSource, DataSourceConfig } from "apollo-datasource";
import { TTTContext } from "../environment";
import { GameModel, UserModel } from "../store";
import { Token } from "../generated/models";

export class GameStore extends DataSource<TTTContext> {
  private context!: TTTContext;

  initialize({ context }: DataSourceConfig<TTTContext>) {
    this.context = context;
  }

  async getAllGames(): Promise<GameModel[]> {
    const g = await GameModel.findAll({ include: includeUsers });
    return g;
  }

  async findGameById(gameId: string): Promise<GameModel> {
    const game = await GameModel.findByPk(gameId);
    if (game) {
      return await reloadUsers(game);
    } else {
      throw new Error(`game ${gameId} not found`);
    }
  }

  async findFirstPartialGame(): Promise<GameModel | null> {
    throw new Error("findFirstPartialGame not implemented");
  }

  async createGame(id: string, userId: string): Promise<GameModel> {
    const game = await GameModel.create({ id });
    return this.joinGame(game, userId, Token.O);
  }

  async joinGame(game: GameModel, userId: string, withToken: Token): Promise<GameModel> {
    const user = await UserModel.findByPk(userId);
    if (withToken === Token.O) {
      await game.setUserO(user!);
    } else {
      await game.setUserX(user!);
    }
    await reloadUsers(game);
    return game;
  }

  async findOrCreateUser(
    id: string
  ): Promise<{ userModel: UserModel; created: boolean }> {
    const [userModel, created] = await UserModel.findOrCreate({ where: { id } });
    return { userModel, created };
  }

  async findAllUsers(): Promise<UserModel[]> {
    const users = await UserModel.findAll();
    return users;
  }
}

const reloadUsers = async (game: GameModel): Promise<GameModel> =>
  await game.reload({
    include: includeUsers
  });

const includeUser = (as: "userO" | "userX") => {
  return {
    model: UserModel,
    as,
    include: [{ model: UserModel, as: "user" }]
  };
};

const includeUsers = [includeUser("userO"), includeUser("userX")];
