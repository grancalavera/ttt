import * as game from "resolvers/game";
import * as users from "resolvers/users";
import * as util from "resolvers/util";
import {
  GameResultResolvers,
  MutationResolvers,
  QueryResolvers,
  Resolvers,
} from "../generated/graphql";

const Query: QueryResolvers = {
  users: (_, __, ctx) => users.list(ctx),
  whoami: (_, __, ctx) => ctx.secure(util.whoami),
  myGames: (_, __, ctx) => ctx.secure(game.myGames(ctx)),
  ping: util.ping,
};

const GameResult: GameResultResolvers = {
  __resolveType: ({ __typename }) => enforceTypename("GameResult", __typename),
};

const Mutation: MutationResolvers = {
  register: (_, __, ctx) => users.register(ctx),
  join: async (_, __, ctx) => ctx.secure(game.join(ctx)),
  play: (_, { input }, ctx) => ctx.secure(game.play(ctx, input)),
};

export const resolvers: Resolvers = { Query, Mutation, GameResult };

const enforceTypename = <T extends string>(
  unionType: string,
  typename?: T
): T => {
  if (typename) {
    return typename;
  }
  throw new Error(
    `missing required "__typename" for union type "${unionType}"`
  );
};
