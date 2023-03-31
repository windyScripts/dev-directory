import { User } from 'server/models';

export type UserProfile = Pick<User, 'id'
  | 'discord_user_id'
  | 'discord_name'
  | 'bio'
  | 'twitter_username'
  | 'linkedin_url'
  | 'github_username'
  | 'website'>;

export interface UserObject {
  email: string;
  discord_user_id: string;
  discord_name: string;
  bio: string;
  twitter_username: string;
  linkedin_url: string;
  github_username: string;
  website: string;
}
