import { User, Flag } from 'server/models';
import TestServer from 'server/test/server';
import { createUser } from 'server/test/utils';

describe('flags API', () => {
  let server: TestServer;
  let user: User;
  let user2: User;

  beforeAll(async () => {
    server = new TestServer();
    await server.init();
    user = await createUser();
    user2 = await createUser();
  });

  afterAll(async () => {
    await server.destroy();
  });

  describe('GET /api/flags', () => {
    it('should return unauthorized for not logged in user', async () => {
      // create a flag for each user
      const res = await server.exec.get('/api/flags');

      expect(res.status).toBe(401);
    });

    it('should return a specified user\'s flag', async () => {
      // create a flag for each user
      await Flag.create({ user_id: user.id, name: 'test' });
      await Flag.create({ user_id: user2.id, name: 'test2' });
      server.login(user);
      const res = await server.exec.get('/api/flags');
      server.logout();

      expect(res.status).toBe(200);
      expect(res.body.flags).toEqual(['test']);
    });
  });
});
