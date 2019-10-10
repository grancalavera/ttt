import { Model, NUMBER, Sequelize, STRING } from "sequelize";

export class MoveModel extends Model {
  public readonly id!: string;
  public readonly player!: string;
  public readonly position!: number;

  public readonly gameId!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const create = (storage: string) => {
  const sequelize = new Sequelize({
    dialect: "sqlite",
    storage,
    logging: () => {}
  });

  MoveModel.init(
    {
      id: { type: STRING, primaryKey: true, allowNull: false },
      player: { type: STRING, allowNull: false },
      position: { type: NUMBER, allowNull: false },
      gameId: { type: STRING, allowNull: false }
    },
    { sequelize, tableName: "standalone-moves" }
  );

  return sequelize;
};
