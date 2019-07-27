import { chooseAvatar } from "./common";
import { LOGGED_IN } from "./environment";
import {
  Game,
  MutationResolvers,
  QueryResolvers,
  Resolvers,
  User
} from "./generated/models";

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
  me: (_, __, { userStatus }) => (userStatus.kind === LOGGED_IN ? userStatus.user : null)
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
