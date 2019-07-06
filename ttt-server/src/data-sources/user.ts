import { DataSource, DataSourceConfig } from "apollo-datasource";
import { Context } from "../environment";
import { UserModel } from "../store";
import { User, MutationLoginArgs } from "../generated/models";

export class UserAPI extends DataSource<Context> {
  private context!: Context;

  initialize(config: DataSourceConfig<Context>) {
    this.context = config.context;
  }

  async findOrCreateUser(maybeLoginArgs?: MutationLoginArgs) {
    const findOrCreateOrNull = () =>
      maybeLoginArgs ? inStore_findOrCreateUser(maybeLoginArgs) : null;

    // We need to check for kind in runtime because context
    // is created by other means besides the context parameter
    // to the apollo constructor. For instance `dataSources`
    // are added to the context as well...
    if (this.context.kind) {
      switch (this.context.kind) {
        // no idea why we should end up here... if we're logged in
        // why would we try to log in again?
        case "LoggedIn":
          return inStore_findOrCreateUser(this.context.user);
        case "LoggedOut":
          return findOrCreateOrNull();
        default:
          return assertNever(this.context);
      }
    } else {
      return findOrCreateOrNull();
    }
  }
}

const inStore_findOrCreateUser = async (user: MutationLoginArgs): Promise<User> => {
  const { alias, email } = user;
  const [userModel] = await UserModel.findOrCreate({ where: { alias, email } });
  return { id: userModel.id.toString(), alias: userModel.alias, email: userModel.email };
};

function assertNever(x: never): never {
  throw new Error(`unexpected object ${x}`);
}
