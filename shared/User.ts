export interface ServerUser {
  id: number;
  email: string;
  discord_user_id: string;
  discord_name: string;
  bio: string;
  twitter_username: string;
  linkedin_url: string;
  github_username: string;
  website: string;
  created_at: Date;
  updated_at: Date;
}

export type ClientUser = Omit<ServerUser, 'email' | 'created_at' | 'updated_at'>;
