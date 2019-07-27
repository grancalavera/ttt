import {
  QueryResolvers,
  Resolvers,
  MutationResolvers,
  GameLobby,
  JoinGame,
  Avatar
} from "./generated/models";
import { AuthenticationError } from "apollo-server";
import { assertNever } from "./common";

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
        const id = "test-lobby";
        const game: GameLobby = {
          id,
          __typename: "GameLobby",
          waiting: { user: { email: "mrpopo@email.com", id: "0" }, avatar: Avatar.X }
        };
        return Promise.resolve<JoinGame>({
          gameId: id,
          game
        });
      default:
        return assertNever(context);
    }
  }
};

const resolvers: Resolvers = { Query, Mutation };

export { resolvers };
