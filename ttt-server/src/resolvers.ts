import { DataSources } from "./data-sources";
import { UnknownUser } from "./types";

const Query = {
  me: (_: any, __: any, { dataSources }: { dataSources: DataSources }) =>
    dataSources.userAPI.findOrCreateUser()
};

const Mutation = {
  login: async (
    _: any,
    newUser: UnknownUser,
    { dataSources }: { dataSources: DataSources }
  ) => {
    const user = await dataSources.userAPI.findOrCreateUser(newUser);
    return user ? new Buffer(user.email + user.alias).toString("base64") : undefined;
  }
};

export const resolvers = { Query, Mutation };
