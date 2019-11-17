import { User } from "../entity/user";
import { QueryResolvers, MutationResolvers } from "../generated/graphql";
import { registerUser } from "../auth";

const Query: QueryResolvers = {
  users: async () => User.find(),
  whoami: (_, __, { secure }) => secure(user => `your user id is ${user.id}`),
  ping: () => "pong"
};

const Mutation: MutationResolvers = {
  join: (_, __, { secure }) => secure(() => true),
  register: (_, __, { res }) => registerUser(res)
};

export const resolvers = { Query, Mutation };
