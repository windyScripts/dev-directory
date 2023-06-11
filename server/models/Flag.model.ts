import {
  AllowNull,
  AutoIncrement,
  Column,
  CreatedAt,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import { FlagName, FlagType as FlagAttributes } from 'shared/Flag';

import User from './User.model';

type FlagCreationAttributes = Omit<FlagAttributes, 'id' | 'created_at' | 'updated_at'>;

@Table({
  tableName: 'flags',
  timestamps: true,
  indexes: [
    { unique: true, fields: ['user_id', 'name'] },
  ],
})
class Flag extends Model<FlagAttributes, FlagCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => User)
  @AllowNull
  @Column
  user_id: number;

  @AllowNull(false)
  @Column
  name: FlagName;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}

export default Flag;
