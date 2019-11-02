import { Game, User } from "./generated/models";
import { UserModel } from "./store";

export type PromiseType<T> = T extends Promise<infer U> ? U : T;

export type UserStatus = LoggedOut | LoggedIn;

export interface LoggedOut {
  isLoggedIn: false;
}

export interface LoggedIn {
  isLoggedIn: true;
  user: User;
}

export const loggedOut: UserStatus = { isLoggedIn: false };

type TypeNames = Exclude<Game["__typename"], undefined>;

export const GameTypename: { [k in TypeNames]: k } = {
  GameOverTie: "GameOverTie",
  GameOverWin: "GameOverWin",
  GamePlaying: "GamePlaying"
};

export const loginFromModel = (model: UserModel): LoggedIn => ({
  isLoggedIn: true,
  user: userFromModel(model)
});

export const userFromModel = (userModel?: UserModel): User => {
  if (userModel) {
    return { id: userModel.id };
  } else {
    throw new Error("cannot convert undefined `UserModel` to `User`");
  }
};
