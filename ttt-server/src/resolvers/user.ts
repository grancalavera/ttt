import * as isEmail from "isemail";
import { TTTContext } from "../environment";
import { User } from "../generated/models";
import { userFromModel } from "../model";
import { pubsub, PUBSUB_USER_CREATED } from "../pubsub";

export const getMe = (context: TTTContext): User | null => {
  const { userStatus } = context;
  return userStatus.isLoggedIn ? userStatus.user : null;
};

export const login = async (email: string, context: TTTContext): Promise<string> => {
  const {
    dataSources: { gameStore },
    userStatus
  } = context;

  if (userStatus.isLoggedIn) {
    return createToken(userStatus.user.id);
  } else {
    isEmail.validate(email);
    const { userModel, created } = await gameStore.findOrCreateUser(email);
    if (created) {
      pubsub.publish(PUBSUB_USER_CREATED, { userCreated: userFromModel(userModel) });
    }
    return createToken(userModel.id.toString());
  }
};

export const getAllUsers = async (context: TTTContext) => {
  const userModels = await context.dataSources.gameStore.findAllUsers();
  const users = userModels.map(userFromModel);
  return users;
};

const createToken = (email: string): string => {
  const token = new Buffer(email).toString("base64");
  return token;
};
