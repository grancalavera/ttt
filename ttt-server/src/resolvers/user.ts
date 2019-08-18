import * as isEmail from "isemail";

import { assertNever } from "../common";
import { TTTContext } from "../environment";
import { User } from "../generated/models";
import { LOGGED_IN, LOGGED_OUT, userFromModel } from "../model";
import { pubsub, PUBSUB_USER_CREATED } from "../pubsub";

export const getMe = (context: TTTContext): User | null => {
  const { userStatus } = context;
  return userStatus.kind === LOGGED_IN ? userStatus.user : null;
};

export const login = async (email: string, context: TTTContext): Promise<string> => {
  const {
    dataSources: { gameStore },
    userStatus
  } = context;

  switch (userStatus.kind) {
    case LOGGED_IN:
      return createToken(userStatus.user.email);
    case LOGGED_OUT:
      isEmail.validate(email);
      const { userModel, created } = await gameStore.findOrCreateUser(email);
      if (created) {
        pubsub.publish(PUBSUB_USER_CREATED, { userCreated: userFromModel(userModel) });
      }
      return createToken(userModel.email);
    default:
      return assertNever(userStatus);
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
