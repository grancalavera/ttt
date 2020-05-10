import { DataSource, DataSourceConfig } from "apollo-datasource";
import { createAccessToken } from "auth";
import { Context, DataSourceContext } from "context";
import { UserEntity } from "entity/user-entity";
import { setRefreshTokenCookie } from "server/router";
import { v4 as uuid } from "uuid";

export class UsersDataSource extends DataSource<Context> {
  private context!: DataSourceContext;

  initialize(config: DataSourceConfig<DataSourceContext>) {
    this.context = config.context;
  }

  async register() {
    const { user, accessToken } = await registerUser();
    setRefreshTokenCookie(this.context.res, user);
    return { user, accessToken };
  }

  find = () => UserEntity.find();
}

export const registerUser = async () => {
  const user = await createUser();
  const accessToken = createAccessToken(user);
  return { user, accessToken };
};

const createUser = async () => {
  const user = new UserEntity();
  user.id = uuid();
  await user.save();
  await user.reload();
  return user;
};
