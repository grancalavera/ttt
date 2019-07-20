import { Sequelize, Model, INTEGER, STRING, NUMBER } from "sequelize";

export const store = new Sequelize({
  dialect: "sqlite",
  storage: "./store.sqlite"
});

export class GameModel extends Model {
  public readonly id!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly moves!: MoveModel[];
}

export class MoveModel extends Model {
  public readonly id!: number;
  public readonly player!: string;
  public readonly position!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

GameModel.init(
  {
    id: { type: INTEGER, autoIncrement: true, primaryKey: true }
  },
  { sequelize: store, tableName: "games", underscored: true }
);

MoveModel.init(
  {
    id: { type: INTEGER, autoIncrement: true, primaryKey: true },
    player: { type: STRING, allowNull: false },
    position: { type: NUMBER, allowNull: false }
  },
  { sequelize: store, tableName: "moves" }
);

GameModel.hasMany(MoveModel, { as: "moves" });
MoveModel.belongsTo(GameModel);
// { as: 'Tasks', through: 'worker_tasks', foreignKey: 'userId' }
