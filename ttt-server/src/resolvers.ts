import {
  QueryResolvers,
  Resolvers,
  MutationResolvers,
  GameLobby,
  JoinGame,
  User
} from "./generated/models";
import { chooseAvatar } from "./common";

const joinNewGame = async (user: User): Promise<JoinGame> => {
  const id = "test-lobby";
  const game: GameLobby = {
    id,
    __typename: "GameLobby",
    waiting: { user, avatar: chooseAvatar() }
  };
  return Promise.resolve<JoinGame>({
    gameId: id,
    game
  });
};

const joinGame = joinNewGame;

const Query: QueryResolvers = {
  me: (_, __, { dataSources }) => {
    return dataSources.userAPI.findOrCreateUser();
  }
};

const Mutation: MutationResolvers = {
  login: async (_, newUser, { dataSources }) => {
    const user = await dataSources.userAPI.findOrCreateUser(newUser);
    return user ? new Buffer(user.email).toString("base64") : null;
  },
  joinGame: async (_, __, { resolveWithSecurity }) =>
    resolveWithSecurity(user => joinGame(user))
};

const resolvers: Resolvers = { Query, Mutation };

export { resolvers };
