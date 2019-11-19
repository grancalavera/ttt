import { User } from "../entity/user";
import { QueryResolvers, MutationResolvers, Token } from "../generated/graphql";
import { registerUser } from "../auth";
import uuid from "uuid";

const Query: QueryResolvers = {
  users: async () => User.find(),
  whoami: (_, __, { secure }) => secure(user => `your user id is ${user.id}`),
  ping: () => "pong"
};

const Mutation: MutationResolvers = {
  join: (_, __, { secure }) =>
    secure(() => ({ gameId: uuid(), token: Token.O, next: Token.O })),
  register: (_, __, { res }) => registerUser(res)
};

export const resolvers = { Query, Mutation };
