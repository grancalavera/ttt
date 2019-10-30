import { handleSimpleError } from "../common";
import {
  MutationResolvers,
  QueryResolvers,
  Resolvers,
  SubscriptionResolvers
} from "../generated/models";
import { getAllGames } from "./get-all-games";
import { joinGame } from "./join-game";
import { playMove } from "./play-move";
import {
  subscribeToGameAdded,
  subscribeToGameChanged,
  subscribeToMovePlayed,
  subscribeToUserCreated
} from "./subscriptions";
import { getAllUsers, getMe, login } from "./user";

const Query: QueryResolvers = {
  me: (_, __, context) => getMe(context),
  games: (_, __, context) => getAllGames(context).catch(handleSimpleError),
  users: (_, __, context) => getAllUsers(context).catch(handleSimpleError)
};

const Mutation: MutationResolvers = {
  login: async (_, { id }, context) => login(context, id),
  joinGame: (_, __, context) => {
    const { resolveWithSecurity } = context;
    return resolveWithSecurity(user => joinGame(user, context));
  },
  playMove: (_, { gameId, avatar, position }, context) => {
    const { resolveWithSecurity } = context;
    return resolveWithSecurity(() => playMove(gameId, avatar, position, context));
  }
};

const Subscription: SubscriptionResolvers = {
  gameAdded: subscribeToGameAdded,
  gameChanged: subscribeToGameChanged,
  movePlayed: subscribeToMovePlayed,
  userCreated: subscribeToUserCreated
};

const resolvers: Resolvers = { Query, Mutation, Subscription };
export { resolvers };
