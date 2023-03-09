import OAuth from 'discord-oauth2';
import { cleanEnv, str } from 'envalid';
import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

import { getDiscordUserAndGuilds, upsertUser } from 'server/lib/auth';
import log from 'server/lib/log';
import { AUTH_COOKIE_NAME } from 'shared/constants';

const env = cleanEnv(process.env, {
  AUTH_SECRET: str()
})

export const login: RequestHandler<void, void, { code: string }> = async (req, res) => {
  const { code } = req.body;

  if (!code) {
    res.sendStatus(400);
    return;
  }

  let discordUser: OAuth.User;
  try {
    const info = await getDiscordUserAndGuilds(code);
    discordUser = info.user;
  } catch (err) {
    log('Errored when attempting to use discord OAuth', err);
    return res.sendStatus(500);
  }

  // todo: ensure guild matches 100devs guild ID

  const user = await upsertUser(discordUser)

  const payload = {
    id: user.id,
  };

  const token = jwt.sign(payload, env.AUTH_SECRET, { expiresIn: '7d' });

  res.cookie(AUTH_COOKIE_NAME, token, { secure: env.isProd });

  res.sendStatus(200);
};
