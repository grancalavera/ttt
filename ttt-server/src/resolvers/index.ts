import { MutationResolvers, QueryResolvers, Resolvers, User } from "../generated/models";
import { joinGame } from "./join-game";
import { getAllGames } from "./get-all-games";
import { assertNever } from "../common";
import { LOGGED_IN, LOGGED_OUT } from "../model";

const Query: QueryResolvers = {
  me: (_, __, { userStatus }) => (userStatus.kind === LOGGED_IN ? userStatus.user : null),
  games: (_, __, { dataSources }) => getAllGames(dataSources)
};

const Mutation: MutationResolvers = {
  login: async (_, { email }, context) => {
    const {
      dataSources: { gameStore: userDataSource },
      userStatus
    } = context;
    let userEmail;
    switch (userStatus.kind) {
      case LOGGED_IN:
        userEmail = userStatus.user.email;
        break;
      case LOGGED_OUT:
        const user = await userDataSource.findOrCreateUser(email);
        userEmail = user.email;
        break;
      default:
        assertNever(userStatus);
    }
    return userEmail ? new Buffer(userEmail).toString("base64") : null;
  },
  joinGame: async (_, __, { resolveWithSecurity, dataSources }) =>
    resolveWithSecurity(user => joinGame(user, dataSources))
};

const resolvers: Resolvers = { Query, Mutation };

export { resolvers };
