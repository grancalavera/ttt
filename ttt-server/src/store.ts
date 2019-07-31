import { Sequelize, Model, INTEGER, STRING, ENUM, NUMBER } from "sequelize";
import { GameState } from "./generated/models";
import { assertNever } from "./common";
import { number } from "prop-types";

// might be worth exploring how to generate the constants
// for an union type's __typename
type GameModelState = Exclude<GameState["__typename"], undefined>;

// form the generated `Game` type (above) we have all the
// required information to generate this code

export const GameModelLobby: GameModelState = "GameLobby";
export const GameModelPlaying: GameModelState = "GamePlaying";
export const GameModelOverWin: GameModelState = "GameOverWin";
export const GameModelOverTie: GameModelState = "GameOverTie";

const gameStatus = [GameModelLobby, GameModelPlaying, GameModelOverWin, GameModelOverTie];

// ensure we didn't forget any state
gameStatus.forEach(status => {
  switch (status) {
    case GameModelLobby:
      break;
    case GameModelPlaying:
      break;
    case GameModelOverWin:
      break;
    case GameModelOverTie:
      break;
    default:
      assertNever(status);
  }
});

// http://docs.sequelizejs.com/manual/getting-started#note--setting-up-sqlite
export const store = new Sequelize({
  dialect: "sqlite",
  storage: "./store.sqlite"
});

export class UserModel extends Model {
  public readonly id!: number;
  public readonly email!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export class GameModel extends Model {
  public readonly id!: string;
  public readonly status!: GameModelState;
  public readonly waitingInLobby?: number;
  public readonly oPlayer?: number;
  public readonly xPlayer?: number;
}

UserModel.init(
  {
    id: { type: INTEGER, autoIncrement: true, primaryKey: true },
    email: { type: STRING, allowNull: false }
  },
  { sequelize: store, tableName: "users" }
);

GameModel.init(
  {
    id: { type: STRING, primaryKey: true },
    status: { type: ENUM(...gameStatus), allowNull: false },
    waitingInLobby: { type: NUMBER },
    oPlayer: { type: NUMBER },
    xPlayer: { type: NUMBER }
  },
  {
    sequelize: store,
    tableName: "Games"
  }
);
