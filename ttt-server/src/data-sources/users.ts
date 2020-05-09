import { DataSource, DataSourceConfig } from "apollo-datasource";
import { createAccessToken, createRefreshToken, sendRefreshToken } from "auth";
import { Context, DataSourceContext } from "context";
import { UserEntity } from "entity/user-entity";
import { v4 as uuid } from "uuid";

export class UsersDataSource extends DataSource<Context> {
  private context!: DataSourceContext;

  initialize(config: DataSourceConfig<DataSourceContext>) {
    this.context = config.context;
  }

  async register() {
    const user = await createUser();
    sendRefreshToken(this.context.res, createRefreshToken(user));
    return { user, accessToken: createAccessToken(user) };
  }

  find = () => UserEntity.find();
}

export const createUser = async () => {
  const user = new UserEntity();
  user.id = uuid();
  await user.save();
  await user.reload();
  return user;
};
