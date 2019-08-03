import uuid from "uuid/v4";

import { chooseAvatar } from "./common";
import { LOGGED_IN, TTTDataSources } from "./environment";
import {
  Game,
  MutationResolvers,
  QueryResolvers,
  Resolvers,
  User
} from "./generated/models";

export const joinGame = async (
  user: User,
  dataSources: TTTDataSources
): Promise<Game> => {
  // 1. find if there's already a game that we can join
  // yes -> return joinExistingGame()
  const id = uuid();
  const avatar = chooseAvatar();

  await dataSources.gameAPIDataSource.postGame(id);
  await dataSources.gameDescriptionDataSource.create(id, user, avatar);

  return Promise.resolve<Game>({
    id,
    state: {
      __typename: "GameLobby",
      waiting: { user, avatar }
    }
  });
};

const Query: QueryResolvers = {
  me: (_, __, { userStatus }) => (userStatus.kind === LOGGED_IN ? userStatus.user : null)
};

const Mutation: MutationResolvers = {
  login: async (_, { email }, { dataSources: { userDataSource } }) => {
    const user = await userDataSource.findOrCreateUser(email);
    return user ? new Buffer(user.email).toString("base64") : null;
  },
  joinGame: async (_, __, { resolveWithSecurity, dataSources }) =>
    resolveWithSecurity(user => joinGame(user, dataSources))
};

const resolvers: Resolvers = { Query, Mutation };

export { resolvers };
