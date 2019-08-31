import { INTEGER, Model, NUMBER, Sequelize, STRING } from "sequelize";

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

export const create = (storage: string) => {
  const sequelize = new Sequelize({
    dialect: "sqlite",
    storage
  });

  GameModel.init(
    {
      id: { type: STRING, primaryKey: true },
      nextPlayer: { type: STRING },
      status: { type: STRING, allowNull: false },
      winner: { type: STRING }
    },
    { sequelize, tableName: "games" }
  );

  MoveModel.init(
    {
      id: { type: INTEGER, autoIncrement: true, primaryKey: true },
      player: { type: STRING, allowNull: false },
      position: { type: NUMBER, allowNull: false },
      gameId: { type: STRING, allowNull: false }
    },
    { sequelize, tableName: "moves" }
  );

  // GameModel.hasMany(MoveModel, { as: "moves", foreignKey: "gameId", sourceKey: "id" });
  // MoveModel.belongsTo(GameModel, { foreignKey: "gameId", targetKey: "id" });

  return sequelize;
};
