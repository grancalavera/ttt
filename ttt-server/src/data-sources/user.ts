import { DataSource, DataSourceConfig } from "apollo-datasource";

import { assertNever } from "../common";
import { Context, LOGGED_IN, LOGGED_OUT } from "../environment";
import { User } from "../generated/models";
import { UserModel } from "../store";

export class UserAPI extends DataSource<Context> {
  private context!: Context;

  initialize(config: DataSourceConfig<Context>) {
    this.context = config.context;
  }

  async findOrCreateUser(email: string): Promise<User> {
    const { userStatus } = this.context;
    switch (userStatus.kind) {
      case LOGGED_IN:
        return userStatus.user;
      case LOGGED_OUT:
        const [userModel] = await UserModel.findOrCreate({ where: { email } });
        return {
          id: userModel.id.toString(),
          email: userModel.email
        };
      default:
        return assertNever(userStatus);
    }
  }
}
