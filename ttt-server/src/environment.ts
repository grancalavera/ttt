import { User } from "./generated/models";
import { UserAPI } from "./data-sources/user";
import { UserModel } from "./store";
import { Request } from "express";
import * as isEmail from "isemail";
import { AuthenticationError } from "apollo-server";
import { assertNever } from "./common";

export const LOGGED_OUT = "LOGGED_OUT";
export const LOGGED_IN = "LOGGED_IN";

type PromiseType<T> = T extends Promise<infer U> ? U : T;

type UserStatus = LoggedOut | LoggedIn;

interface LoggedOut {
  kind: typeof LOGGED_OUT;
}

interface LoggedIn {
  kind: typeof LOGGED_IN;
  user: User;
}

const logIn = (user: User): LoggedIn => ({
  kind: LOGGED_IN,
  user
});

const logOut: LoggedOut = { kind: LOGGED_OUT };

export const dataSources = () => ({
  userAPI: new UserAPI()
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

const resolveUserStatus = async (req: Request): Promise<UserStatus> => {
  //
  // if auth is empty, don't even try, return the default context
  const auth = req.headers.authorization || "";
  if (!auth) return logOut;

  //
  // again, if the email is valid, don't even try, return the default context
  const decoded = new Buffer(auth, "base64").toString("ascii");
  if (!isEmail.validate(decoded)) return logOut;

  //
  // now go to the store and try to find the user
  const maybeUser = await UserModel.findOne({ where: { email: decoded } });

  if (!maybeUser) {
    //
    // again, if is not found, just return the default context
    return logOut;
  } else {
    //
    // otherwise add the user to the default context and login
    const { id, email } = maybeUser;
    return logIn({ id: id.toString(), email });
  }
};

export const context = async ({ req }: { req: Request }) => {
  const userStatus = await resolveUserStatus(req);
  const resolveWithSecurity: SecureCallback = makeSecureResolver(userStatus);
  return { userStatus, resolveWithSecurity };
};

export type Context = PromiseType<ReturnType<typeof context>> & {
  dataSources: ReturnType<typeof dataSources>;
};
