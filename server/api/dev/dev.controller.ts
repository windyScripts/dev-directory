import { cleanEnv } from 'envalid';
import { RequestHandler } from 'express';
import { InternalServerError, NotFoundError } from 'express-response-errors';

import { createAuthToken } from 'server/lib/auth';
import log from 'server/lib/log';
import { User } from 'server/models';
import * as Utils from 'server/test/utils';
import { AUTH_COOKIE_NAME } from 'shared/constants';

const env = cleanEnv(process.env, {});

const getLogin: RequestHandler<{ id?: string }> = async (req, res) => {
  const userId = req.params.id ? parseInt(req.params.id as string, 10) : null;

  let user: User;
  if (userId != null) {
    user = await User.findByPk(userId, { attributes: User.allowedFields });
    if (!user) throw new NotFoundError('User not found');
  } else {
    user = await Utils.createUser();
    if (!user) throw new InternalServerError('Unable to create user');
  }

  const token = createAuthToken(user);

  res.cookie(AUTH_COOKIE_NAME, token, { secure: env.isProd });
  res.sendStatus(200);
};

const postRunUtil: RequestHandler<{ method: string; args: unknown[] }> = async (req, res) => {
  const { method, args } = req.body;

  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const result = await Utils[method](...args);

    res.json(result);
    res.status(200);
  } catch (error) {
    log(`An error occurred while executing ${method}(${args.join('')}): ${error.message}`);
    throw new InternalServerError(`An error occurred while executing ${method}(${args.join('')})`);
  }
};

export {
  getLogin,
  postRunUtil,
};
