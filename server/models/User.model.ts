import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';
import Db from 'server/lib/db';

// order of InferAttributes & InferCreationAttributes is important.
class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  // 'CreationOptional' is a special type that marks the field as optional
  // when creating an instance of the model (such as using Model.create()).
  declare id: CreationOptional<number>;
  declare email: string;
  declare discord_user_id: string;
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  discord_user_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  }
}, {
  sequelize: Db.sequelize,
  tableName: 'users',
});

export default User;
