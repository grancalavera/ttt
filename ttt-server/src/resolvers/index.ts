import { LOGGED_IN } from "../environment";
import { MutationResolvers, QueryResolvers, Resolvers } from "../generated/models";
import { joinGame } from "./join-game-mutation";
import { getAllGames } from "./games-query";

const Query: QueryResolvers = {
  me: (_, __, { userStatus }) => (userStatus.kind === LOGGED_IN ? userStatus.user : null),
  games: (_, __, { dataSources }) => getAllGames(dataSources)
};

const Mutation: MutationResolvers = {
  login: async (_, { email }, { dataSources: { gameStore: userDataSource } }) => {
    const user = await userDataSource.findOrCreateUser(email);
    return user ? new Buffer(user.email).toString("base64") : null;
  },
  joinGame: async (_, __, { resolveWithSecurity, dataSources }) =>
    resolveWithSecurity(user => joinGame(user, dataSources))
};

const resolvers: Resolvers = { Query, Mutation };

export { resolvers };
