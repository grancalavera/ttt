import { MutationResolvers, QueryResolvers, Resolvers } from "../generated/models";
import { handleSimpleError } from "./common";
import { getAllGames } from "./get-all-games";
import { joinGame } from "./join-game";
import * as user from "./user";

const Query: QueryResolvers = {
  me: (_, __, context) => user.me(context),
  games: (_, __, context) => getAllGames(context).catch(handleSimpleError)
};

const Mutation: MutationResolvers = {
  login: async (_, { email }, context) => user.login(email, context),
  joinGame: (_, __, context) => {
    const { resolveWithSecurity, dataSources } = context;
    return resolveWithSecurity(user => joinGame(user, dataSources));
  }
};

const resolvers: Resolvers = { Query, Mutation };
export { resolvers };
