import { QueryResolvers, Resolvers, MutationResolvers } from "./generated/models";

const Query: QueryResolvers = {
  me: (_, __, { dataSources }) => {
    return dataSources.userAPI.findOrCreateUser();
  }
};

const Mutation: MutationResolvers = {
  login: async (_, newUser, { dataSources }) => {
    const user = await dataSources.userAPI.findOrCreateUser(newUser);
    return user ? new Buffer(user.email).toString("base64") : null;
  }
};

const resolvers: Resolvers = { Query, Mutation };

export { resolvers };
