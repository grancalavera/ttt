import { QueryResolvers, Resolvers, MutationResolvers } from "./generated/models";
import { ResolverContext } from "./environment";

const Query: QueryResolvers<ResolverContext> = {
  me: (_, __, { dataSources }) => dataSources.userAPI.findOrCreateUser()
};

const Mutation: MutationResolvers<ResolverContext> = {
  login: async (_, newUser, { dataSources, SPLITTER }) => {
    const user = await dataSources.userAPI.findOrCreateUser(newUser);
    return user
      ? new Buffer(user.email + SPLITTER + user.alias).toString("base64")
      : null;
  }
};

const resolvers: Resolvers<ResolverContext> = { Query, Mutation };

export { resolvers };
