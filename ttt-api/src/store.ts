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

  public readonly gameId!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const toUnsafeMove = ({ player, position }: MoveModel): [string, number] => [
  player,
  position
];

GameModel.init(
  {
    id: { type: STRING, primaryKey: true },
    nextPlayer: { type: STRING },
    status: { type: STRING, allowNull: false },
    winner: { type: STRING }
  },
  { sequelize: store, tableName: "games" }
);

MoveModel.init(
  {
    id: { type: INTEGER, autoIncrement: true, primaryKey: true },
    player: { type: STRING, allowNull: false },
    position: { type: NUMBER, allowNull: false }
  },
  { sequelize: store, tableName: "moves" }
);

GameModel.hasMany(MoveModel, { as: "moves", foreignKey: "gameId", sourceKey: "id" });
MoveModel.belongsTo(GameModel, { foreignKey: "gameId", targetKey: "id" });
