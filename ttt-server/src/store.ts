import { Sequelize, Model, INTEGER, STRING } from "sequelize";

// http://docs.sequelizejs.com/manual/getting-started#note--setting-up-sqlite
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./store.sqlite"
});

class UserModel extends Model {
  public id!: number;
  public alias!: string;
  public email!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UserModel.init(
  {
    id: { type: INTEGER, autoIncrement: true, primaryKey: true },
    alias: { type: STRING, allowNull: false },
    email: { type: STRING, allowNull: false }
  },
  { sequelize, tableName: "users" }
);

export { UserModel, sequelize as store };
