import { QueryResolvers, Resolvers, MutationResolvers } from "./generated/models";
import { Context } from "./types";

const Query: QueryResolvers<Context> = {
  me: (_, __, { dataSources }) => dataSources.userAPI.findOrCreateUser()
};

const Mutation: MutationResolvers<Context> = {
  login: async (_, newUser, { dataSources }) => {
    const user = await dataSources.userAPI.findOrCreateUser(newUser);
    return user ? new Buffer(user.email + user.alias).toString("base64") : null;
  }
};

const resolvers: Resolvers<Context> = { Query, Mutation };

export { resolvers };
