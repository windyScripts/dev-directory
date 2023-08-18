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

interface InterestsAttributes {
  interest_id: number;
  interest_name: string;
  created_at: Date;
  updated_at: Date;
}

@Table({
  tableName: 'Interests',
  timestamps: true,
})

class Interests extends Model<InterestsAttributes> implements InterestsAttributes {
    @PrimaryKey
    @AllowNull(false)
    @AutoIncrement
    @Column
    interest_id: number;

    @AllowNull(false)
    @Length({ max: 100 })
    @Column
    interest_name: string;

    @CreatedAt
    created_at: Date;

    @UpdatedAt
    updated_at: Date;
}

export default Interests;
