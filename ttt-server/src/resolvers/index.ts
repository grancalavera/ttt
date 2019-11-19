import uuid from "uuid";
import { MutationResolvers, QueryResolvers, Token } from "../generated/graphql";

const Query: QueryResolvers = {
  users: (_, __, { dataSources }) => dataSources.users.find(),
  whoami: (_, __, { secure }) => secure(user => `your user id is ${user.id}`),
  ping: () => "pong"
};

const Mutation: MutationResolvers = {
  join: async (_, __, { secure, dataSources }) =>
    secure(async user => {
      const game = await dataSources.games.create(user);
      return { gameId: game.id, token: Token.O, next: Token.O };
    }),
  register: (_, __, { dataSources }) => dataSources.users.register()
};

export const resolvers = { Query, Mutation };
