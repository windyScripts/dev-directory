import {
  AllowNull,
  Column,
  CreatedAt,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

interface UserInterestsAttributes {
  user_id: number;
  interest_name: string;
  created_at: Date;
  updated_at: Date;
}

import Interests from './Interests.model';
import User from './User.model';

@Table({
  tableName: 'UserInterests',
  timestamps: true,
})

class UserInterests extends Model<UserInterestsAttributes> implements UserInterestsAttributes {
      @ForeignKey(() => User)
      @Column
      user_id: number;

      @ForeignKey(() => Interests)
      @AllowNull(false)
      @Column
      interest_name: string;

      @CreatedAt
      created_at: Date;

      @UpdatedAt
      updated_at: Date;
}

export default UserInterests;
