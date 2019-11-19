import { DataSource, DataSourceConfig } from "apollo-datasource";
import { createAccessToken, createRefreshToken, sendRefreshToken } from "auth";
import { TTTContext } from "context";
import { User } from "entity/user";

export class UsersDataSource extends DataSource<TTTContext> {
  private context!: TTTContext;

  initialize(config: DataSourceConfig<TTTContext>) {
    this.context = config.context;
  }

  async register() {
    const user = new User();
    await user.save();
    await user.reload();
    sendRefreshToken(this.context.res, createRefreshToken(user));
    return { user, accessToken: createAccessToken(user) };
  }

  find = () => User.find();
}
