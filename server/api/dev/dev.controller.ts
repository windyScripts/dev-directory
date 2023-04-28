import { cleanEnv } from 'envalid';
import { RequestHandler } from 'express';
import { InternalServerError, NotFoundError } from 'express-response-errors';

import { createAuthToken } from 'server/lib/auth';
import log from 'server/lib/log';
import { User } from 'server/models';
import { createUser, createUsers, truncateDatabase } from 'server/test/utils';
import { AUTH_COOKIE_NAME } from 'shared/constants';

const env = cleanEnv(process.env, {});

const getCreateUsers: RequestHandler<{ count?: string }, { status: string; data: User[] }> = async (req, res) => {
  const count = req.params?.count ? parseInt(req.params?.count as string, 10) : 1;
  let users: User[];

  try {
    users = await createUsers(count);

    res.json({ status: 'Success', data: users });
    res.status(200);
  } catch (error) {
    throw new InternalServerError('Unable to create user');
  }
};

const getLogin: RequestHandler<{ id?: string }> = async (req, res) => {
  const userId = req.params.id ? parseInt(req.params.id as string, 10) : null;

  let user: User;
  if (userId != null) {
    user = await User.findByPk(userId, { attributes: User.allowedFields });
    if (!user) throw new NotFoundError('User not found');
  } else {
    user = await createUser();
    if (!user) throw new InternalServerError('Unable to create user');
  }

  const token = createAuthToken(user);

  res.cookie(AUTH_COOKIE_NAME, token, { secure: env.isProd });
  res.sendStatus(200);
};

const getTruncateDatabase: RequestHandler = async (req, res) => {
  try {
    await truncateDatabase();

    res.json({ status: 'Success', message: 'Database truncated' });
    res.status(200);
  } catch (error) {
    log(`Unable to truncate database: ${error.message}`);
    throw new InternalServerError('Unable to truncate database');
  }
};

const getSeedDatabase: RequestHandler = async (req, res) => {
  try {
    // Doesn't populate future tables
    await createUsers(100);

    res.json({ status: 'Success', message: 'Database seeded' });
    res.status(200);
  } catch (error) {
    log(`Unable to seed database: ${error.message}`);
    throw new InternalServerError('Unable to seed database');
  }
};

export {
  getCreateUsers,
  getLogin,
  getTruncateDatabase,
  getSeedDatabase,
};
