import { User } from "./generated/models";
import { UserAPI } from "./data-sources/user";
import { UserModel } from "./store";
import { Request } from "express";
import * as isEmail from "isemail";

interface DefaultContext {}

interface LoggedOutContext extends DefaultContext {
  kind: "LoggedOut";
}

interface LoggedInContext extends DefaultContext {
  kind: "LoggedIn";
  user: User;
}

export type Context = LoggedOutContext | LoggedInContext;
export type DataSources = ReturnType<typeof dataSources>;
export type ResolverContext = Context & { dataSources: DataSources };

export const dataSources = () => ({
  userAPI: new UserAPI()
});

const defaultContext: LoggedOutContext = { kind: "LoggedOut" };

const logIn = (user: User): LoggedInContext => ({
  ...defaultContext,
  kind: "LoggedIn",
  user
});

export const context = async ({ req }: { req: Request }): Promise<Context> => {
  //
  // if auth is empty, don't even try, return the default context
  const auth = req.headers.authorization || "";
  if (!auth) return defaultContext;

  //
  // again, if the email is valid, don't even try, return the default context
  const decoded = new Buffer(auth, "base64").toString("ascii");
  if (!isEmail.validate(decoded)) return defaultContext;

  //
  // now go to the store and try to find the user
  const maybeUser = await UserModel.findOne({ where: { email: decoded } });

  if (!maybeUser) {
    //
    // again, if is not found, just return the default context
    return defaultContext;
  } else {
    //
    // otherwise add the user to the default context and login
    const { id, alias, email } = maybeUser;
    return logIn({ id: id.toString(), email });
  }
};
