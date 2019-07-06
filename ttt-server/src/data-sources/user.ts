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
    // We need to check for `kind` in runtime because context
    // is created by other means besides the context parameter
    // to the apollo constructor. For instance `dataSources`
    // are added to the context as well. When the context parameter
    // hasn't been provider, we get a context, but *not* the context
    // in the type signature.
    if (this.context.kind) {
      switch (this.context.kind) {
        case "LoggedIn":
          // we end up here when the request has an `authorization` header
          return inStore_findOrCreateUser(this.context.user);
        case "LoggedOut":
          // we end up here either when:
          // 1. there is no authorization header and someone
          //    is querying `me` (for instance), or
          // 2. there is no authorization header ans someone
          //    is mutating `login` (for instance)
          return maybeLoginArgs ? inStore_findOrCreateUser(maybeLoginArgs) : null;
        default:
          return assertNever(this.context);
      }
    } else {
      // this is just and odd case, might happen as above, when the
      // context function hasn't been assigned to the apollo server
      // parameters in the constructor. no need to worry I think,
      // just do noting and return null
      return null;
    }
  }
}

const inStore_findOrCreateUser = async (user: MutationLoginArgs): Promise<User> => {
  const { alias, email } = user;
  const [userModel] = await UserModel.findOrCreate({ where: { alias, email } });
  return {
    id: userModel.id.toString(),
    alias: userModel.alias,
    email: userModel.email
  };
};

function assertNever(x: never): never {
  throw new Error(`unexpected object ${x}`);
}
