import {
  AllowNull,
  AutoIncrement,
  Column,
  CreatedAt,
  Default,
  Length,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';

interface SkillsAttributes {
  id: number;
  skill_id: number;
  skill_name: string;
  created_at: Date;
  updated_at: Date;
}

@Table({
  tableName: 'Skills',
  timestamps: true,
})

class Skills extends Model<SkillsAttributes> implements SkillsAttributes {

  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

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