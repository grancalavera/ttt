import {
  Sequelize,
  Model,
  INTEGER,
  STRING,
  ENUM,
  BelongsToGetAssociationMixin,
  Association,
  BelongsToSetAssociationMixin,
  BOOLEAN
} from "sequelize";
import { Avatar, Position } from "./generated/models";

export class UserModel extends Model {
  public readonly id!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export class PlayerModel extends Model {
  public id!: number;
  public avatar!: Avatar;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getUser!: BelongsToGetAssociationMixin<UserModel>;
  public setUser!: BelongsToSetAssociationMixin<UserModel, UserModel["id"]>;
  public user?: UserModel;

  public static associations: {
    user: Association<PlayerModel, UserModel>;
  };
}

export class GameModel extends Model {
  public id!: string;
  public isInLobby!: boolean;

  public firstMoveAvatar!: Avatar;
  public firstMovePosition!: Position;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getPlayerO!: BelongsToGetAssociationMixin<PlayerModel>;
  public setPlayerO!: BelongsToSetAssociationMixin<PlayerModel, PlayerModel["id"]>;
  public playerO?: PlayerModel;

  public getPlayerX!: BelongsToGetAssociationMixin<PlayerModel>;
  public setPlayerX!: BelongsToSetAssociationMixin<PlayerModel, PlayerModel["id"]>;
  public playerX?: PlayerModel;

  public static associations: {
    playerO: Association<GameModel, PlayerModel>;
    playerX: Association<GameModel, PlayerModel>;
  };
}

export const create = ({ storage }: { storage: string }) => {
  const sequelize = new Sequelize({
    dialect: "sqlite",
    logging: false,
    storage
  });

  UserModel.init(
    {
      id: { type: STRING, primaryKey: true }
    },
    { sequelize, tableName: "ttt-users" }
  );

  PlayerModel.init(
    {
      id: { type: INTEGER, autoIncrement: true, primaryKey: true },
      avatar: { type: ENUM("O", "X"), allowNull: false }
    },
    { sequelize, tableName: "ttt-players" }
  );

  GameModel.init(
    {
      id: { type: STRING, primaryKey: true },
      isInLobby: { type: BOOLEAN, defaultValue: true }
    },
    { sequelize, tableName: "ttt-games" }
  );

  PlayerModel.belongsTo(UserModel, { as: "user", foreignKey: "user_id" });
  GameModel.belongsTo(PlayerModel, { as: "playerO", foreignKey: "playerO_id" });
  GameModel.belongsTo(PlayerModel, { as: "playerX", foreignKey: "playerX_id" });

  return sequelize;
};
