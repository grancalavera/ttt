import { Avatar, Game, Player, User } from "./generated/models";
import { PlayerModel, UserModel } from "./store";

export const LOGGED_OUT = "LOGGED_OUT";
export const LOGGED_IN = "LOGGED_IN";

export type PromiseType<T> = T extends Promise<infer U> ? U : T;

export type UserStatus = LoggedOut | LoggedIn;

export interface LoggedOut {
  kind: typeof LOGGED_OUT;
}

export interface LoggedIn {
  kind: typeof LOGGED_IN;
  user: User;
}

type TypeNames = Exclude<Game["__typename"], undefined>;

export const GameTypename: { [k in TypeNames]: k } = {
  GameLobby: "GameLobby",
  GameOverTie: "GameOverTie",
  GameOverWin: "GameOverWin",
  GamePlaying: "GamePlaying"
};

export const loginFromModel = (model: UserModel): LoggedIn => ({
  kind: LOGGED_IN,
  user: userFromModel(model)
});

export const userFromModel = (userModel: UserModel): User => {
  return {
    email: userModel.email,
    id: userModel.id.toString()
  };
};

export const playerFromModel = (playerModel: PlayerModel): Player => {
  return {
    avatar: playerModel.avatar as Avatar,
    user: userFromModel(playerModel.user!)
  };
};
