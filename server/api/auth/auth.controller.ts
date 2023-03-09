import OAuth from 'discord-oauth2';
import { cleanEnv, str } from 'envalid';
import { RequestHandler } from 'express';
import { BadRequestError, InternalServerError } from 'express-response-errors';

import { createAuthToken, getDiscordUserAndGuilds, upsertUser } from 'server/lib/auth';
import log from 'server/lib/log';
import { AUTH_COOKIE_NAME } from 'shared/constants';

const env = cleanEnv(process.env, {
  AUTH_SECRET: str(),
  DISCORD_GUILD_ID: str(),
})

export const login: RequestHandler<void, void, { code: string }> = async (req, res) => {
  const { code } = req.body;

  if (!code) {
    throw new BadRequestError('Missing OAuth code')
  }

  let discordUser: OAuth.User;
  let guilds: OAuth.PartialGuild[]
  try {
    const info = await getDiscordUserAndGuilds(code);
    discordUser = info.user;
    guilds = info.guilds;
  } catch (err) {
    log('Errored when attempting to use discord OAuth', err);
    throw new InternalServerError('Error attempting to use discord OAuth')
  }

  if (!guilds.find(guild => guild.id === env.DISCORD_GUILD_ID)) {
    throw new BadRequestError('You must be a member of 100devs discord to join')
  }

  const user = await upsertUser(discordUser)
  const token = createAuthToken(user)

  res.cookie(AUTH_COOKIE_NAME, token, { secure: env.isProd });
  res.sendStatus(200);
};

export const logout: RequestHandler = async (req, res) => {
  res.clearCookie(AUTH_COOKIE_NAME)
  res.sendStatus(200);
}
