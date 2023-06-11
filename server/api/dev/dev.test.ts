import jwt from 'jsonwebtoken';

import 'server/lib/config-env';
import { User } from 'server/models';
import TestServer from 'server/test/server';
import { createUser, getCookie } from 'server/test/utils';
import { AUTH_COOKIE_NAME } from 'shared/constants';

describe('developer/testing routes', () => {
  let server: TestServer;

  beforeAll(async () => {
    server = new TestServer();
    await server.init();
  });

  afterAll(async () => {
    await server.destroy();
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

  describe('POST /api/dev/run-util', () => {
    it('allows test utility functions to be run', async () => {
      const res = await server.exec.post('/api/dev/run-util').send({
        method: 'createUsers',
        args: [20],
      });

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(20);
    });
  });
});
