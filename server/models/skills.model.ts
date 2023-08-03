import {
  AllowNull,
  AutoIncrement,
  Column,
  CreatedAt,
  Length,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

interface SkillsAttributes {
  skill_id: number;
  skill_name: string;
  created_at: Date;
  updated_at: Date;
}

@Table({
  tableName:'Skills',
  timestamps: true,
})

class Skills extends Model<SkillsAttributes> implements SkillsAttributes {
  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Column
  skill_id: number;

  @AllowNull(false)
  @Length({ max: 100 })
  @Column
  skill_name: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}

export default Skills;
