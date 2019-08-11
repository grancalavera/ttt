import {
  MutationResolvers,
  QueryResolvers,
  Resolvers,
  PlayMoveResult
} from "../generated/models";
import { handleSimpleError, handleMoveError } from "./common";
import { getAllGames } from "./get-all-games";
import { joinGame } from "./join-game";
import * as user from "./user";
import { playMove } from "./play-move";

const Query: QueryResolvers = {
  me: (_, __, context) => user.me(context),
  games: (_, __, context) => getAllGames(context).catch(handleSimpleError)
};

const Mutation: MutationResolvers = {
  login: async (_, { email }, context) => user.login(email, context),
  joinGame: (_, __, context) => {
    const { resolveWithSecurity, dataSources } = context;
    return resolveWithSecurity(user => joinGame(user, dataSources));
  },
  playMove: (_, { gameId, avatar, position }, context) => {
    const { resolveWithSecurity } = context;
    return resolveWithSecurity(() => playMove(gameId, avatar, position, context));
  }
};

const resolvers: Resolvers = { Query, Mutation };
export { resolvers };
