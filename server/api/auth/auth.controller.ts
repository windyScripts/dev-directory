import DiscordOauth2 from 'discord-oauth2';
import { cleanEnv, str } from 'envalid';
import { RequestHandler } from 'express';
import { BadRequestError, InternalServerError } from 'express-response-errors';

import { createAuthToken, getDiscordUserAndGuilds, upsertUser } from 'server/lib/auth';
import log from 'server/lib/log';
import { Flag } from 'server/models';
import { AUTH_COOKIE_NAME } from 'shared/constants';
import { CurrentUserResponse } from 'shared/http';

const env = cleanEnv(process.env, {
  AUTH_SECRET: str(),
  DISCORD_GUILD_ID: str(),
});

export const getCurrentUser: RequestHandler<void, CurrentUserResponse> = async (req, res) => {
  const { user } = req;

  if (!user) {
    return res.json({ user: null, flags: [] });
  }

  const flags = await Flag.findAll({ where: { user_id: user.id }});
  const flagNames = flags.map(flag => flag.name);

  res.json({ user: user.profile, flags: flagNames });
};

export const login: RequestHandler<void, CurrentUserResponse, { code: string }> = async (req, res) => {
  const { code } = req.body;

  if (!code) {
    throw new BadRequestError('Missing OAuth code');
  }

  let discordUser: DiscordOauth2.User;
  let guilds: DiscordOauth2.PartialGuild[];
  try {
    const info = await getDiscordUserAndGuilds(code);
    discordUser = info.user;
    guilds = info.guilds;
  } catch (err) {
    log('Errored when attempting to use discord OAuth', err);
    throw new InternalServerError('Error attempting to use discord OAuth');
  }

  if (!guilds.find(guild => guild.id === env.DISCORD_GUILD_ID)) {
    throw new BadRequestError('You must be a member of 100devs discord to join');
  }

  const user = await upsertUser(discordUser);
  console.log(user);
  const token = createAuthToken(user);

  res.cookie(AUTH_COOKIE_NAME, token, { secure: env.isProd });

  const flags = await Flag.findAll({ where: { user_id: user.id }});

  res.json({
    user: user.profile,
    flags: flags.map(f => f.name),
  });
};

export const logout: RequestHandler = async (req, res) => {
  res.clearCookie(AUTH_COOKIE_NAME);
  res.sendStatus(200);
};
