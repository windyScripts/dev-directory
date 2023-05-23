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

import { ServerUser as UserAttributes } from 'shared/User';

type UserCreationAttributes = Omit<UserAttributes, 'id' | 'created_at' | 'updated_at'>;

@Table({
  tableName: 'users',
  timestamps: true,
  underscored: true,
})
class User extends Model<UserAttributes, UserCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @Column
  email: string;

  @AllowNull(false)
  @Unique(true)
  @Column
  discord_user_id: string;

  @AllowNull(false)
  @Length({ max: 100 })
  @Column
  discord_name: string;

  @AllowNull(false)
  @Default('')
  @Length({ max: 1000 })
  @Column
  bio: string;

  @AllowNull(false)
  @Default('')
  @Length({ max: 200 })
  @Column
  twitter_username: string;

  @AllowNull(false)
  @Default('')
  @Length({ max: 200 })
  @Column
  linkedin_url: string;

  @AllowNull(false)
  @Default('')
  @Length({ max: 200 })
  @Column
  github_username: string;

  @AllowNull(false)
  @Default('')
  @Length({ max: 200 })
  @Column
  website: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  public static get allowedFields() {
    return [
      'id',
      'discord_user_id',
      'discord_name',
      'bio',
      'twitter_username',
      'linkedin_url',
      'github_username',
      'website',
    ];
  }
}

export default User;
