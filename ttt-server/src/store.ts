import { Sequelize, Model, INTEGER, STRING, ENUM, NUMBER } from "sequelize";
import { GameStateKind, AllStateKinds } from "./model";

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
  const store = new Sequelize({
    dialect: "sqlite",
    storage
  });

  UserModel.init(
    {
      id: { type: INTEGER, autoIncrement: true, primaryKey: true },
      email: { type: STRING, allowNull: false }
    },
    { sequelize: store, tableName: "Users" }
  );

  GameModel.init(
    {
      id: { type: STRING, primaryKey: true },
      status: {
        type: ENUM(...AllStateKinds),
        allowNull: false
      },
      waitingInLobby: { type: INTEGER },
      oPlayer: { type: INTEGER },
      xPlayer: { type: INTEGER }
    },
    {
      sequelize: store,
      tableName: "Games"
    }
  );

  return store;
};
