import { Sequelize, Model, INTEGER, STRING, NUMBER } from "sequelize";

export const store = new Sequelize({
  dialect: "sqlite",
  storage: "./store.sqlite"
});

export class GameModel extends Model {
  public readonly id!: number;
  public readonly nextPlayer!: string;
  public readonly status!: string;
  public readonly winner!: string;
  public readonly moves!: MoveModel[];

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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
    id: { type: INTEGER, autoIncrement: true, primaryKey: true },
    nextPlayer: { type: STRING, allowNull: false },
    status: { type: STRING, allowNull: false },
    winner: { type: STRING }
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
