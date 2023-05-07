import { AllowNull, AutoIncrement, Column, CreatedAt, Default, DeletedAt, Model, PrimaryKey, Table, Unique, UpdatedAt } from 'sequelize-typescript';
import { ServerUser as UserAttributes } from 'shared/User';

type UserCreationAttributes = Omit<UserAttributes, "id" | "createdAt" | "updatedAt">;

@Table({
  tableName: 'users',
  timestamps: true,
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
  @Column
  discord_name: string;

  @AllowNull(false)
  @Default('')
  @Column
  bio: string;
  
  @AllowNull(false)
  @Default('')
  @Column
  twitter_username: string;
  
  @AllowNull(false)
  @Default('')
  @Column
  linkedin_url: string;
  
  @AllowNull(false)
  @Default('')
  @Column
  github_username: string;
  
  @AllowNull(false)
  @Default('')
  @Column
  website: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

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
