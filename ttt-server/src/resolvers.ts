import { TTTDataSources } from "./data-sources";
import { UnknownUser } from "./types";

const Query = {
  me: (_: any, __: any, { dataSources }: { dataSources: TTTDataSources }) =>
    dataSources.userAPI.findOrCreateUser()
};

const Mutation = {
  login: async (
    _: any,
    newUser: UnknownUser,
    { dataSources }: { dataSources: TTTDataSources }
  ) => {
    const user = await dataSources.userAPI.findOrCreateUser(newUser);
    return user ? new Buffer(user.email).toString("base64") : undefined;
  }
};

export const resolvers = { Query, Mutation };
