import {
  Sequelize,
  Model,
  DataTypes,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyHasAssociationMixin,
  Association,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin
} from "sequelize";

class User extends Model {
  // Note that the `null assertion` `!` is required in strict mode.
  public id!: number;
  public name!: string;
  // for nullable fields
  public preferredName!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.

  public getProjects!: HasManyGetAssociationsMixin<Project>;
  public addProject!: HasManyAddAssociationMixin<Project, number>;
  public hasProject!: HasManyHasAssociationMixin<Project, number>;
  public countProjects!: HasManyCountAssociationsMixin;
  public createProject!: HasManyCreateAssociationMixin<Project>;

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  // Note this is optional since it's only populated when explicitly requested in code
  public readonly projects?: Project[];

  public static associations: {
    projects: Association<User, Project>;
  };
}

class Project extends Model {
  public id!: number;
  public ownerId!: number;
  public name!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

class Address extends Model {
  public userId!: number;
  public address!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "sandbox.sqlite"
});

Project.init(
  {
    id: {
      // you can omit the `new` but this is discouraged
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: "example-projects"
  }
);

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    preferredName: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    tableName: "example-users",
    // this bit is important
    sequelize
  }
);

Address.init(
  {
    userId: {
      type: DataTypes.INTEGER
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: "example-address",
    // this bit is important
    sequelize
  }
);

// Here we associate which actually populates out pre-declared `association` static
// and other methods.
User.hasMany(Project, {
  sourceKey: "id",
  foreignKey: "ownerId",
  // this determines the name in `associations`
  as: "projects"
});

Address.belongsTo(User, { targetKey: "id", foreignKey: "addressBelongsToUser" });
User.hasOne(Address, { sourceKey: "id", foreignKey: "userHasOneAddress" });

async function stuff() {
  // Please note that when using async/await you lose the `bluebird` promise context
  // and you fall back to native

  const newUser = await User.create({
    name: "Johnny",
    preferredName: "John"
  });

  await newUser.createProject({
    name: "first!"
  });

  const ourUser = await User.findByPk(1, {
    include: [User.associations.projects],
    // Specifying true here removes `null` from the return type
    rejectOnEmpty: true
  });

  // Note the `!` null assertion since TS can't know if we included
  // the model or not
  console.log(ourUser.projects![0].name);
}

sequelize.sync({ force: true }).then(stuff);
