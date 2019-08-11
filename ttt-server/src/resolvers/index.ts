import { ErrorResponse } from "@grancalavera/ttt-api";

import { assertNever } from "../common";
import { MutationResolvers, QueryResolvers, Resolvers } from "../generated/models";
import { LOGGED_IN, LOGGED_OUT } from "../model";
import { getAllGames } from "./get-all-games";
import { joinGame } from "./join-game";

const Query: QueryResolvers = {
  me: (_, __, { userStatus }) => (userStatus.kind === LOGGED_IN ? userStatus.user : null),
  games: (_, __, { dataSources }) => getAllGames(dataSources).catch(handleSimpleError)
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

const getErrorResponse = (error?: any): ErrorResponse => {
  if (
    error &&
    error.extensions &&
    error.extensions.response &&
    error.extensions.response.body &&
    error.extensions.response.body.code &&
    typeof error.extensions.response.body.code === "string" &&
    error.extensions.response.body.message &&
    typeof error.extensions.response.body.message === "string" &&
    error.extensions.response.body.context &&
    typeof error.extensions.response.body.context === "object"
  ) {
    return error.extensions.response.body as ErrorResponse;
  } else {
    throw new Error(error);
  }
};

const handleSimpleError = (error?: any) => {
  const errorResponse = getErrorResponse(error);
  throw new Error(errorResponse.message);
};
