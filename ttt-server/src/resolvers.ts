import {
  QueryResolvers,
  Resolvers,
  MutationResolvers,
  GameLobby,
  JoinGame,
  Avatar,
  Game,
  User
} from "./generated/models";
import { AuthenticationError } from "apollo-server";
import { assertNever, chooseAvatar } from "./common";

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
  joinGame: async (_, __, context) => {
    switch (context.kind) {
      case "LoggedOut":
        throw new AuthenticationError("Unauthorized");
      case "LoggedIn":
        return joinGame(context.user);
      default:
        return assertNever(context);
    }
  }
};

const resolvers: Resolvers = { Query, Mutation };

export { resolvers };
