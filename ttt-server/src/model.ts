import { Avatar, Game, Player, User } from "./generated/models";
import { PlayerModel, UserModel } from "./store";

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
  GameLobby: "GameLobby",
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

export const playerFromModel = (playerModel?: PlayerModel): Player => {
  if (playerModel) {
    return {
      avatar: playerModel.avatar as Avatar,
      user: userFromModel(playerModel.user)
    };
  } else {
    throw new Error("undefined playerModel. Did you forget to call `reloadPlayers`?");
  }
};
