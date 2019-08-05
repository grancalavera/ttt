import { AuthenticationError } from "apollo-server";
import { Request } from "express";
import isEmail from "isemail";

import { assertNever } from "./common";
import { GameStore } from "./data-sources/game-store";
import { User } from "./generated/models";
import { UserModel } from "./store";
import { GameAPI } from "./data-sources/game-api";
import { loginFromModel, UserStatus, LOGGED_IN, LOGGED_OUT, PromiseType } from "./model";

export const dataSources = () => ({
  gameStore: new GameStore(),
  gameAPI: new GameAPI("http://localhost:5000")
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

const resolveUserStatus = async (req: Request): Promise<UserStatus> => {
  // if auth is empty => logout
  const auth = req.headers.authorization || "";
  if (!auth) return logout;

  // if email is invalid => logout
  const decoded = new Buffer(auth, "base64").toString("ascii");
  if (!isEmail.validate(decoded)) return logout;

  const maybeUser = await UserModel.findOne({ where: { email: decoded } });
  return maybeUser ? loginFromModel(maybeUser) : logout;
};

export const context = async ({ req }: { req: Request }) => {
  const userStatus = await resolveUserStatus(req);
  const resolveWithSecurity: SecureCallback = makeSecureResolver(userStatus);
  const gameAPIBaseURL = "http://localhost:9000";
  return { userStatus, resolveWithSecurity, gameAPIBaseURL };
};
export type TTTDataSources = ReturnType<typeof dataSources>;
export type Context = PromiseType<ReturnType<typeof context>> & {
  dataSources: TTTDataSources;
};
