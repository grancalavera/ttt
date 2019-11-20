import {
  MutationResolvers,
  QueryResolvers,
  Token,
  PlayInput
} from "../generated/graphql";
import { TTTDataSources } from "context";
import { User } from "entity/user";

const Query: QueryResolvers = {
  users: (_, __, { dataSources }) => dataSources.users.find(),
  whoami: (_, __, { secure }) => secure(user => `your user id is ${user.id}`),
  ping: () => "pong"
};

const Mutation: MutationResolvers = {
  register: (_, __, { dataSources }) => registerHandler(dataSources),

  join: async (_, __, { secure, dataSources }) =>
    secure(user => joinHandler(user, dataSources)),

  play: (_, { input }, { secure, dataSources }) =>
    secure(user => playHandler(input, user, dataSources))
};

const registerHandler = (dataSources: TTTDataSources) =>
  dataSources.users.register();

const joinHandler = async (user: User, dataSources: TTTDataSources) => {
  const game = await dataSources.games.create(user);
  return { gameId: game.id, token: Token.O, next: Token.O };
};

const playHandler = async (
  input: PlayInput,
  user: User,
  dataSources: TTTDataSources
) => {
  const { gameId, position, token } = input;
  throw "";
};

export const resolvers = { Query, Mutation };
