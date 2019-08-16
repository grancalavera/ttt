import { withFilter, ResolverFn, FilterFn } from "apollo-server";

import { handleSimpleError } from "../common";
import {
  MutationResolvers,
  QueryResolvers,
  Resolvers,
  SubscriptionResolvers,
  Game
} from "../generated/models";
import { PUBSUB_GAME_CHANGED, PUBSUB_MOVE_PLAYED, pubsub } from "../pubsub";
import { getAllGames } from "./get-all-games";
import { joinGame } from "./join-game";
import { playMove } from "./play-move";
import * as user from "./user";

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

const resolveMovePlayedSubscription: ResolverFn = () =>
  pubsub.asyncIterator([PUBSUB_MOVE_PLAYED]);

const filterMovePlayedSubscription: FilterFn = (game: Game, { gameId }) =>
  gameId === game.__typename;

const resolveGameChangedSubscription: ResolverFn = () => {
  return pubsub.asyncIterator([PUBSUB_GAME_CHANGED]);
};

const filterGameChangedSubscription: FilterFn = (
  { gameChanged }: { gameChanged: Game },
  { gameId }
) => {
  return gameId === gameChanged.id;
};

const Subscription: SubscriptionResolvers = {
  gameChanged: {
    subscribe: withFilter(resolveGameChangedSubscription, filterGameChangedSubscription)
  },
  movePlayed: {
    subscribe: withFilter(resolveMovePlayedSubscription, filterMovePlayedSubscription)
  }
};

const resolvers: Resolvers = { Query, Mutation, Subscription };

export { resolvers };
