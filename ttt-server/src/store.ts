import {
  Association,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  Model,
  Sequelize,
  STRING
} from "sequelize";

export class UserModel extends Model {
  public readonly id!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export class GameModel extends Model {
  public id!: string;

  public getUserO!: BelongsToGetAssociationMixin<UserModel>;
  public setUserO!: BelongsToSetAssociationMixin<UserModel, UserModel["id"]>;
  public userO?: UserModel;

  public getUserX!: BelongsToGetAssociationMixin<UserModel>;
  public setUserX!: BelongsToSetAssociationMixin<UserModel, UserModel["id"]>;
  public userX?: UserModel;

  public static associations: {
    userO: Association<GameModel, UserModel>;
    userX: Association<GameModel, UserModel>;
  };

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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

  GameModel.init(
    {
      id: { type: STRING, primaryKey: true }
    },
    { sequelize, tableName: "ttt-games" }
  );

  GameModel.belongsTo(UserModel, { as: "userO", foreignKey: "userO_id" });
  GameModel.belongsTo(UserModel, { as: "userX", foreignKey: "userX_id" });

  return sequelize;
};
