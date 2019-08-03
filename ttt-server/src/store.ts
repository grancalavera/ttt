import { Sequelize, Model, INTEGER, STRING, ENUM, NUMBER } from "sequelize";
import {
  GameStateKind,
  GAME_LOBBY,
  GAME_OVER_TIE,
  GAME_OVER_WIN,
  GAME_PLAYING
} from "./model";

export class UserModel extends Model {
  public readonly id!: number;
  public readonly email!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export class GameModel extends Model {
  public readonly id!: string;
  public readonly status!: GameStateKind;
  public readonly waitingInLobby?: number;
  public readonly oPlayer?: number;
  public readonly xPlayer?: number;
}

export const create = ({ storage }: { storage: string }) => {
  // http://docs.sequelizejs.com/manual/getting-started#note--setting-up-sqlite
  const store = new Sequelize({
    dialect: "sqlite",
    storage
  });

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
      status: {
        type: ENUM(...[GAME_LOBBY, GAME_PLAYING, GAME_OVER_TIE, GAME_OVER_WIN]),
        allowNull: false
      },
      waitingInLobby: { type: NUMBER },
      oPlayer: { type: NUMBER },
      xPlayer: { type: NUMBER }
    },
    {
      sequelize: store,
      tableName: "Games"
    }
  );

  return store;
};
