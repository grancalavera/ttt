import * as game from "resolvers/game";
import * as users from "resolvers/users";
import * as util from "resolvers/util";
import {
  GameStatusResolvers,
  MutationResolvers,
  QueryResolvers,
  Resolvers,
  SubscriptionResolvers,
} from "../generated/graphql";
import { subscribeToGameChannel } from "./subscribe-to-game-channel";

const Query: QueryResolvers = {
  users: (_, __, ctx) => users.list(ctx),
  whoami: (_, __, ctx) => ctx.secure(util.whoami),
  gameStatus: (_, { gameId }, ctx) => ctx.secure(game.status(ctx, gameId)),
  ping: util.ping,
};

const GameStatus: GameStatusResolvers = {
  __resolveType: ({ __typename }) => enforceTypename("GameStatus", __typename),
};

const Mutation: MutationResolvers = {
  register: (_, __, ctx) => users.register(ctx),
  // join: async (_, __, ctx) => ctx.secure(game.join(ctx)),
  // play: (_, { input }, ctx) => ctx.secure(game.play(ctx, input)),
  channelPlayMove: (_, { input }, ctx) => ctx.secure(game.play(ctx, input)),
  channelJoinGame: (_, __, ctx) => ctx.secure(game.join(ctx)),
};

const Subscription: SubscriptionResolvers = {
  gameChannel: subscribeToGameChannel,
};

export const resolvers: Resolvers = { Query, Mutation, GameStatus, Subscription };

const enforceTypename = <T extends string>(unionType: string, typename?: T): T => {
  if (typename) {
    return typename;
  }
  throw new Error(`missing required "__typename" for union type "${unionType}"`);
};
