import { User } from 'server/models';

export type UserProfile = Pick<User, 'id'
  | 'discord_user_id'
  | 'discord_name'
  | 'bio'
  | 'twitter_username'
  | 'linkedin_url'
  | 'github_username'
  | 'website'>;
