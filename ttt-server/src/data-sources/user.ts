import { DataSource, DataSourceConfig } from "apollo-datasource";
import { Context } from "../environment";
import { UserModel } from "../store";
import { User, MutationLoginArgs } from "../generated/models";

export class UserAPI extends DataSource<Context> {
  private context?: Context;

  initialize(config: DataSourceConfig<Context>) {
    this.context = config.context;
  }

  async findOrCreateUser(newUser?: MutationLoginArgs) {
    if (this.context && this.context.user) {
      return inStore_findOrCreateUser(this.context.user);
    } else if (newUser) {
      return inStore_findOrCreateUser(newUser);
    } else {
      return null;
    }
  }
}

const inStore_findOrCreateUser = async (user: MutationLoginArgs): Promise<User> => {
  const { alias, email } = user;
  const [userModel] = await UserModel.findOrCreate({ where: { alias, email } });
  return { id: userModel.id.toString(), alias: userModel.alias, email: userModel.email };
};
