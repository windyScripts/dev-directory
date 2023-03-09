import OAuth from 'discord-oauth2';
import DiscordOauth2 from 'discord-oauth2';
import { cleanEnv, str } from 'envalid';
import jwt from 'jsonwebtoken';
import { User } from 'server/models';
import { execSync } from 'child_process';

export function validateToken(token: string) {
  let valid;
  try {
    valid = !!jwt.verify(token, process.env.AUTH_SECRET);
  } catch (err) {
    valid = false;
  }

  return valid;
}

export async function getDiscordUserAndGuilds(authCode: string) {
  const oauth = new DiscordOauth2();

  const { access_token } = await oauth.tokenRequest({
    clientId: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    code: authCode,
    scope: 'identify email guild',
    grantType: 'authorization_code',
    redirectUri: process.env.REDIRECT_URI,
  });

  const [user, guilds] = await Promise.all([
    oauth.getUser(access_token),
    oauth.getUserGuilds(access_token),
  ]);

  return { user, guilds };
}

export async function upsertUser(user: OAuth.User) {
  const result = await User.upsert({
    discord_user_id: user.id,
    email: user.email,
  })

  return result[0]
}
