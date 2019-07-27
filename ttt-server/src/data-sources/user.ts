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

  async findOrCreateUser(email?: string) {
    const { userStatus } = this.context;
    switch (userStatus.kind) {
      case LOGGED_IN:
        // we end up here when the request has an `authorization` header
        return inStore_findOrCreateUser(userStatus.user.email);
      case LOGGED_OUT:
        // we end up here either when:
        // 1. there is no authorization header and someone
        //    is querying `me` (for instance), or
        // 2. there is no authorization header and someone
        //    is mutating `login` (for instance)
        return email ? inStore_findOrCreateUser(email) : null;
      default:
        return assertNever(userStatus);
    }
  }
}

const inStore_findOrCreateUser = async (email: string): Promise<User> => {
  const [userModel] = await UserModel.findOrCreate({ where: { email } });
  return {
    id: userModel.id.toString(),
    email: userModel.email
  };
};
