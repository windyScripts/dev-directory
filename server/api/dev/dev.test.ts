import jwt from 'jsonwebtoken';
import setCookie, { Cookie } from 'set-cookie-parser';
import { Response } from 'superagent';

import Db from 'server/lib/db';
import { User } from 'server/models';
import TestServer from 'server/test/server';
import { createUser, createUsers, truncateDatabase } from 'server/test/utils';
import { AUTH_COOKIE_NAME } from 'shared/constants';

describe('developer/testing routes', () => {
  let server: TestServer;

  const excludedModels = ['SequelizeMeta'];
  const models = Object.keys(Db.sequelize.models)
    .filter(key => excludedModels.includes(key));

  beforeAll(async () => {
    server = new TestServer();
    await server.init();
  });

  afterAll(async () => {
    await server.destroy();
  });

  afterEach(async () => {
    await truncateDatabase();
  });

  describe('GET /api/dev/create-users', () => {
    it('creates a single user if no count is specified', async () => {
      const res = await server.exec.get('/api/dev/create-users');
      const userCount = await User.count();

      expect(res.status).toBe(200);
      expect(userCount).toBe(1);
    });

    it('creates a specified number of users', async () => {
      const res = await server.exec.get('/api/dev/create-users/19');
      const userCount = await User.count();

      expect(res.status).toBe(200);
      expect(userCount).toBe(19);
    });
  });

  describe('GET /api/dev/login', () => {
    it('will return NotFoundError if specified user doesn\'t exist', async () => {
      const res = await server.exec.get('/api/dev/login/9999');

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('User not found');
    });

    it('can login as the specified user', async () => {
      const user = await createUser();
      const res = await server.exec.get(`/api/dev/login/${user.id}`);

      const cookie = getCookie(res, AUTH_COOKIE_NAME);
      const cookiePayload = jwt.decode(cookie.value) as { user_id: number };
      const createdUser = await User.findOne({ where: { id: cookiePayload.user_id }});

      expect(res.status).toBe(200);
      expect(createdUser.id).toEqual(cookiePayload.user_id);
    });

    it('will create and login as the new user if no id is specified', async () => {
      const res = await server.exec.get('/api/dev/login');

      const cookie = getCookie(res, AUTH_COOKIE_NAME);
      const cookiePayload = jwt.decode(cookie.value) as { user_id: number };
      const createdUser = await User.findOne({ where: { id: cookiePayload.user_id }});

      expect(res.status).toBe(200);
      expect(createdUser.id).toEqual(cookiePayload.user_id);
    });
  });

  describe('GET /api/dev/truncate-database', () => {
    it('can truncate the database', async () => {
      // Doesn't populate future tables
      await createUsers(20);

      for (const model of models) {
        const count = await Db.sequelize.models[model].count();
        expect(count).toBeGreaterThan(0);
      }

      const res = await server.exec.get('/api/dev/truncate-database');
      for (const model of models) {
        const count = await Db.sequelize.models[model].count();
        expect(count).toBe(0);
      }

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Database truncated');
    });
  });

  describe('GET /api/dev/seed-database', () => {
    it('can seed the database', async () => {
      // Doesn't populate future tables
      const res = await server.exec.get('/api/dev/seed-database');

      for (const model of models) {
        const count = await Db.sequelize.models[model].count();
        expect(count).toBeGreaterThan(0);
      }

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Database seeded');
    });
  });
});

function getCookie(res: Response, name: string): Cookie {
  return res.headers['set-cookie']
    .map((cookieString: string) => setCookie.parse(cookieString)[0])
    .find((cookie: Cookie) => cookie.name === name);
}
