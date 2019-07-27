import {
  QueryResolvers,
  Resolvers,
  MutationResolvers,
  User,
  Game
} from "./generated/models";
import { chooseAvatar } from "./common";

const joinNewGame = async (user: User): Promise<Game> => {
  return Promise.resolve<Game>({
    id: "test-lobby",
    state: {
      __typename: "GameLobby",
      waiting: { user, avatar: chooseAvatar() }
    }
  });
};

const joinGame = joinNewGame;

const Query: QueryResolvers = {
  me: (_, __, { dataSources }) => {
    return dataSources.userAPI.findOrCreateUser();
  }
};

const Mutation: MutationResolvers = {
  login: async (_, { email }, { dataSources }) => {
    const user = await dataSources.userAPI.findOrCreateUser(email);
    return user ? new Buffer(user.email).toString("base64") : null;
  },
  joinGame: async (_, __, { resolveWithSecurity }) =>
    resolveWithSecurity(user => joinGame(user))
};

const resolvers: Resolvers = { Query, Mutation };

export { resolvers };
