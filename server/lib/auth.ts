import DiscordOauth2 from 'discord-oauth2';
import { cleanEnv, str } from 'envalid';
import jwt from 'jsonwebtoken';

import { User } from 'server/models';

const env = cleanEnv(process.env, {
  DISCORD_CLIENT_ID: str(),
  DISCORD_CLIENT_SECRET: str(),
  DISCORD_REDIRECT_URI: str(),
  AUTH_SECRET: str(),
});

export function createAuthToken(user: User) {
  const payload = { user_id: user.id };
  const token = jwt.sign(payload, env.AUTH_SECRET, { expiresIn: '7d' });
  return token;
}

export function validateToken(token: string) {
  let valid;
  try {
    valid = !!jwt.verify(token, env.AUTH_SECRET);
  } catch (err) {
    valid = false;
  }

  return valid;
}

export async function getDiscordUserAndGuilds(authCode: string) {
  const oauth = new DiscordOauth2();

  const { access_token } = await oauth.tokenRequest({
    clientId: env.DISCORD_CLIENT_ID,
    clientSecret: env.DISCORD_CLIENT_SECRET,
    code: authCode,
    scope: 'identify email guild',
    grantType: 'authorization_code',
    redirectUri: env.DISCORD_REDIRECT_URI,
  });

  const [user, guilds] = await Promise.all([
    oauth.getUser(access_token),
    oauth.getUserGuilds(access_token),
  ]);

  return { user, guilds };
}

export async function upsertUser(user: DiscordOauth2.User) {
  console.log(user);
  const result = await User.upsert({
    discord_user_id: user.id,
    discord_name: user.username,
    email: user.email,
  });

  return result[0];
}
