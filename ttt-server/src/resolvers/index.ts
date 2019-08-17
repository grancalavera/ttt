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
import * as user from "./user";
import {
  subscribeToGameChanged,
  subscribeToMovePlayed,
  subscribeToGameAdded
} from "./subscriptions";

const Query: QueryResolvers = {
  me: (_, __, context) => user.me(context),
  games: (_, __, context) => getAllGames(context).catch(handleSimpleError)
};

const Mutation: MutationResolvers = {
  login: async (_, { email }, context) => user.login(email, context),
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
  movePlayed: subscribeToMovePlayed
};

const resolvers: Resolvers = { Query, Mutation, Subscription };
export { resolvers };
