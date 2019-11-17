import { User } from "../entity/user";
import { QueryResolvers, MutationResolvers } from "../generated/graphql";
import { registerUser } from "../auth";

const Query: QueryResolvers = {
  users: async () => User.find(),
  whoami: (_, __, context) =>
    context.secure(token => `your user id is ${token.userId}`),
  ping: () => "pong"
};

const Mutation: MutationResolvers = {
  join: (_, __, context) => context.secure(() => true),
  register: (_, __, { res }) => registerUser(res)
};

export const resolvers = { Query, Mutation };
