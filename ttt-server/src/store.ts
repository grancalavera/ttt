import { Sequelize, Model, INTEGER, STRING, ENUM } from "sequelize";
import { Game } from "./generated/models";

type GameStatus = Exclude<Game["__typename"], undefined>;

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
    status: { type: ENUM("lobby", "playing", "over-win", "over-tie"), allowNull: false }
  },
  {
    sequelize: store,
    tableName: "Games"
  }
);
