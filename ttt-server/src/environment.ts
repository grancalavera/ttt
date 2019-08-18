import { AuthenticationError } from "apollo-server";
import express from "express";
import isEmail from "isemail";

import { assertNever } from "./common";
import { GameStore } from "./data-sources/game-store";
import { User } from "./generated/models";
import { UserModel } from "./store";
import { GameAPI } from "./data-sources/game-api";
import { loginFromModel, UserStatus, LOGGED_IN, LOGGED_OUT } from "./model";
import { ExecutionParams } from "subscriptions-transport-ws";

const apiBaseURL = process.env.API_BASE_URL!;

// if (!apiBaseURL) {
//   throw new Error('missing required environment variable "API_BASE_URL"');
// }

export const dataSources = () => ({
  gameStore: new GameStore(),
  gameAPI: new GameAPI(apiBaseURL || "http://localhost:5000")
});

type SecureCallback = <T>(callback: (user: User) => T) => T;

const makeSecureResolver = <T>(userStatus: UserStatus) => (
  callback: (user: User) => T
): T => {
  switch (userStatus.kind) {
    case LOGGED_IN:
      return callback(userStatus.user);
    case LOGGED_OUT:
      throw new AuthenticationError("Unauthorized");
    default:
      return assertNever(userStatus);
  }
};

const logout = { kind: LOGGED_OUT } as const;

const resolveUserStatus = async (auth?: string): Promise<UserStatus> => {
  if (!auth) return logout;

  // if email is invalid => logout
  const decoded = new Buffer(auth, "base64").toString("ascii");
  if (!isEmail.validate(decoded)) return logout;

  const maybeUser = await UserModel.findOne({ where: { email: decoded } });
  return maybeUser ? loginFromModel(maybeUser) : logout;
};

// This type is defined somewhere in apollo-server-core I think but
// I just was not able to get it from there for some reason.
interface ExpressContext {
  req: express.Request;
  res: express.Response;
  connection?: ExecutionParams<ExpressContext>;
}

export const context = async ({ req, connection }: ExpressContext) => {
  if (connection) {
    return connection.context;
  } else {
    const userStatus = await resolveUserStatus(req.headers.authorization);
    const resolveWithSecurity: SecureCallback = makeSecureResolver(userStatus);
    const ctx = { userStatus, resolveWithSecurity };
    return ctx;
  }
};

export type TTTDataSources = ReturnType<typeof dataSources>;

export interface TTTContext {
  userStatus: UserStatus;
  resolveWithSecurity: SecureCallback;
  dataSources: TTTDataSources;
}
