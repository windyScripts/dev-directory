import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';

import Db from 'server/lib/db';

// order of InferAttributes & InferCreationAttributes is important.
class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  // 'CreationOptional' is a special type that marks the field as optional
  // when creating an instance of the model (such as using Model.create()).
  declare id: CreationOptional<number>;
  declare email: string;
  declare discord_user_id: string;
  declare discord_name: string;
  declare bio: string;
  declare twitter_username: string;
  declare linkedin_url: string;
  declare github_username: string;
  declare website: string;
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  discord_user_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  discord_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  bio: {
    type: DataTypes.STRING(1000),
    allowNull: false,
    defaultValue: '',
  },
  twitter_username: {
    type: DataTypes.STRING(200),
    allowNull: false,
    defaultValue: '',
  },
  linkedin_url: {
    type: DataTypes.STRING(200),
    allowNull: false,
    defaultValue: '',
  },
  github_username: {
    type: DataTypes.STRING(200),
    allowNull: false,
    defaultValue: '',
  },
  website: {
    type: DataTypes.STRING(500),
    allowNull: false,
    defaultValue: '',
  },
}, {
  sequelize: Db.sequelize,
  tableName: 'users',
});

export default User;
