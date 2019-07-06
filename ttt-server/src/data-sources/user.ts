import { DataSource, DataSourceConfig } from "apollo-datasource";
import { GQLContext, User, UnknownUser } from "../types";
import { UserModel } from "../store";

export class UserAPI extends DataSource<GQLContext> {
  private context?: GQLContext;

  initialize(config: DataSourceConfig<GQLContext>) {
    this.context = config.context;
  }

  async findOrCreateUser(newUser?: UnknownUser) {
    if (this.context && this.context.user) {
      return inStore_findOrCreateUser(this.context.user);
    } else if (newUser) {
      return inStore_findOrCreateUser(newUser);
    } else {
      return null;
    }
  }
}

const inStore_findOrCreateUser = async (user: UnknownUser): Promise<User> => {
  const { alias, email } = user;
  const [userModel] = await UserModel.findOrCreate({ where: { alias, email } });
  return { id: userModel.id, alias: userModel.alias, email: userModel.email };
};
