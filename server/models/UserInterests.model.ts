import {
  AllowNull,
  Column,
  CreatedAt,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

interface User_InterestsAttributes {
  user_id: number;
  interest_name: string;
  created_at: Date;
  updated_at: Date;
}

import Interests from './Interests.model';
import User from './User.model';

@Table({
  tableName: 'User_Interests',
  timestamps: true,
})

class User_Interests extends Model<User_InterestsAttributes> implements User_InterestsAttributes {
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

export default User_Interests;
