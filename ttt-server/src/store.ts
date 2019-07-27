import { Sequelize, Model, INTEGER, STRING, ENUM } from "sequelize";
import { Game } from "./generated/models";
import { assertNever } from "./common";

// might be worth exploring how to generate the constants
// for an union type's __typename
type GameStatus = Exclude<Game["__typename"], undefined>;

// form the generated `Game` type (above) we have all the
// required information to generate this code

const __typename_GameLobby: GameStatus = "GameLobby";
const __typename_GamePlaying: GameStatus = "GamePlaying";
const __typename_GameOverWin: GameStatus = "GameOverWin";
const __typename_GameOverTie: GameStatus = "GameOverTie";

const gameStatus = [
  __typename_GameLobby,
  __typename_GamePlaying,
  __typename_GameOverWin,
  __typename_GameOverTie
];

// ensure we didn't forget any state
gameStatus.forEach(status => {
  switch (status) {
    case __typename_GameLobby:
      break;
    case __typename_GamePlaying:
      break;
    case __typename_GameOverWin:
      break;
    case __typename_GameOverTie:
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
  public readonly id!: number;
  public readonly status!: GameStatus;

  // a reference to the game in the API
  public readonly apiGameId?: number;

  // an optional player who might be waiting in the lobby for this game
  public readonly userInLobby?: UserModel;
  public readonly oPlayer?: UserModel;
  public readonly xPlayer?: UserModel;
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
    id: { type: INTEGER, autoIncrement: true, primaryKey: true },
    status: { type: ENUM(...gameStatus), allowNull: false },
    apiGameId: { type: INTEGER, allowNull: false }
  },
  {
    sequelize: store,
    tableName: "Games"
  }
);

GameModel.hasOne(UserModel, { foreignKey: "userInLobby" });
GameModel.hasOne(UserModel, { foreignKey: "oPlayer" });
GameModel.hasOne(UserModel, { foreignKey: "xPlayer" });
