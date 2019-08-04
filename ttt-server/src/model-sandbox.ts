import {
  Model,
  Association,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
  Sequelize,
  STRING,
  INTEGER,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin
} from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "sandbox.sqlite"
});

class UserModel extends Model {
  public id!: number;
  public name!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

class PlayerModel extends Model {
  public id!: number;
  public avatar!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getUser!: BelongsToGetAssociationMixin<UserModel>;
  public setUser!: BelongsToSetAssociationMixin<UserModel, UserModel["id"]>;
  public user?: UserModel;

  public static associations: {
    user: Association<PlayerModel, UserModel>;
  };
}

class GameModel extends Model {
  public id!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getPlayer1!: BelongsToGetAssociationMixin<PlayerModel>;
  public setPlayer1!: BelongsToSetAssociationMixin<PlayerModel, PlayerModel["id"]>;
  public player1?: PlayerModel;

  public getPlayer2!: BelongsToGetAssociationMixin<PlayerModel>;
  public setPlayer2!: BelongsToSetAssociationMixin<PlayerModel, PlayerModel["id"]>;
  public player2?: PlayerModel;

  public static associations: {
    player1: Association<GameModel, PlayerModel>;
    player2: Association<GameModel, PlayerModel>;
  };
}

UserModel.init(
  {
    id: { type: INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: STRING, allowNull: false }
  },
  { sequelize, tableName: "ttt-users" }
);

PlayerModel.init(
  {
    id: { type: INTEGER, autoIncrement: true, primaryKey: true },
    avatar: { type: STRING, allowNull: false }
  },
  { sequelize, tableName: "ttt-players" }
);

GameModel.init(
  {
    id: { type: INTEGER, autoIncrement: true, primaryKey: true }
  },
  { sequelize, tableName: "ttt-games" }
);

PlayerModel.belongsTo(UserModel, { as: "user", foreignKey: "userId" });
GameModel.belongsTo(PlayerModel, { as: "player1", foreignKey: "player1Id" });
GameModel.belongsTo(PlayerModel, { as: "player2", foreignKey: "player2Id" });

sequelize
  .sync({ force: true })
  .then(async () => {
    const alice = await UserModel.create({
      name: "Alice"
    });

    const bob = await UserModel.create({ name: "Bob" });

    const player1 = await PlayerModel.create({ avatar: "o" });
    const player2 = await PlayerModel.create({ avatar: "x" });

    await player1.setUser(alice);
    await player2.setUser(bob);

    const game = await GameModel.create();
    await game.setPlayer1(player1);
    await game.setPlayer2(player2);

    GameModel.findByPk(game.id, {
      include: [
        {
          model: PlayerModel,
          as: "player1",
          include: [{ model: UserModel, as: "user" }]
        },
        { model: PlayerModel, as: "player2", include: [{ model: UserModel, as: "user" }] }
      ]
    }).then(g => {
      console.log("Player 1");
      console.log("--------");
      console.log(g!.player1!.user!.name);
      console.log(g!.player1!.avatar);
      console.log("--------");
      console.log("");

      console.log("Player 2");
      console.log("--------");
      console.log(g!.player2!.user!.name);
      console.log(g!.player2!.avatar);
      console.log("--------");
      console.log("");
    });
  })
  .catch(e => {
    console.log(e.message);
    console.log(e.stack);
  });
