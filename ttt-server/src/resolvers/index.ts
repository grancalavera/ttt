import { MutationResolvers, QueryResolvers } from "../generated/graphql";
import * as game from "resolvers/game";
import * as users from "resolvers/users";
import * as util from "resolvers/util";

const Query: QueryResolvers = {
  users: (_, __, ctx) => users.list(ctx),
  whoami: (_, __, ctx) => ctx.secure(util.whoami),
  myGames: (_, ___, ctx) => ctx.secure(() => []),
  ping: util.ping,
};

const Mutation: MutationResolvers = {
  register: (_, __, ctx) => users.register(ctx),
  join: async (_, __, ctx) => ctx.secure(game.join(ctx)),
  play: (_, { input }, ctx) => ctx.secure(game.play(ctx, input)),
};

export const resolvers = { Query, Mutation };
