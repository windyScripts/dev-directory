import { Model, DataTypes } from 'sequelize';

import Db from 'server/lib/db';

class Flag extends Model {
  public id!: number;
  public user_id!: number;
  public flag_name!: string;

  public static readonly allowedFields: string[] = [
    'id',
    'user_id',
    'flag_name',
  ];

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Flag.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    flag_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: Db.sequelize,
    modelName: 'Flag',
    tableName: 'flags',
  },
);

export default Flag;
