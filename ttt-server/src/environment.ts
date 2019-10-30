import { AuthenticationError } from "apollo-server";
import express from "express";
import { ExecutionParams } from "subscriptions-transport-ws";
import { GameAPI } from "./data-sources/game-api";
import { GameStore } from "./data-sources/game-store";
import { User } from "./generated/models";
import { loggedOut, loginFromModel, UserStatus } from "./model";
import { UserModel } from "./store";

const apiBaseURL = process.env.API_BASE_URL!;

export const dataSources = () => ({
  gameStore: new GameStore(),
  gameAPI: new GameAPI(apiBaseURL || "http://localhost:5000")
});

type SecureCallback = <T>(callback: (user: User) => T) => T;

const makeSecureResolver = <T>(userStatus: UserStatus) => (
  callback: (user: User) => T
): T => {
  if (userStatus.isLoggedIn) {
    return callback(userStatus.user);
  } else {
    throw new AuthenticationError("Unauthorized");
  }
};
/**
 *
 * @param auth a pseudo authorization header that carries the base64
 * encoded user id
 */
const resolveUserStatus = async (auth?: string): Promise<UserStatus> => {
  if (!auth) return loggedOut;
  const id = new Buffer(auth, "base64").toString("ascii");
  const maybeUser = await UserModel.findOne({ where: { id } });
  return maybeUser ? loginFromModel(maybeUser) : loggedOut;
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
