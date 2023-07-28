import {
  AllowNull,
  Column,
  CreatedAt,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

interface UserSkillsAttributes {
  user_id: number;
  skill_id: number;
  created_at: Date;
  updated_at: Date;
}

import Skills from './skills.model';
import User from './User.model';

@Table({
  tableName: 'UserSkills',
  timestamps: true,
})

class UserSkills extends Model<UserSkillsAttributes> implements UserSkillsAttributes {
    @ForeignKey(() => User)
    @Column
    user_id: number;

    @ForeignKey(() => Skills)
    @AllowNull(false)
    @Column
    skill_id: number;

    @CreatedAt
    created_at: Date;

    @UpdatedAt
    updated_at: Date;
}

export default UserSkills;
