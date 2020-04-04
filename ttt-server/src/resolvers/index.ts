import * as game from "resolvers/game";
import * as users from "resolvers/users";
import * as util from "resolvers/util";
import {
  MutationResolvers,
  QueryResolvers,
  Resolvers,
  SubscriptionResolvers,
} from "../generated/graphql";

const Query: QueryResolvers = {
  whoami: (_, __, ctx) => ctx.secure(util.whoami),
  ping: util.ping,
};

const Mutation: MutationResolvers = {
  registerUser: (_, __, ctx) => users.register(ctx),
  openGame: (_, __, ctx) => ctx.secure(game.open()),
  beginGame: (_, { input }, ctx) => ctx.secure(game.begin(input, ctx)),
  resumeGame: (_, { input }, ctx) => ctx.secure(game.resume(input, ctx)),
};

const Subscription: SubscriptionResolvers = {
  gameChanged: game.subscribeToGameChanged,
};

export const resolvers: Resolvers = { Query, Mutation, Subscription };

const enforceTypename = <T extends string>(unionType: string, typename?: T): T => {
  if (typename) {
    return typename;
  }
  throw new Error(`missing required "__typename" for union type "${unionType}"`);
};
