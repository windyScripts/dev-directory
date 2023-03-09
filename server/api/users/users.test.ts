import { randEmail, randNumber } from '@ngneat/falso';
import { User } from 'server/models';
import TestServer from 'server/test/server';

describe('auth router', () => {
  let server: TestServer;

  beforeAll(async () => {
    server = new TestServer();
    await server.init();
  });

  afterAll(async () => {
    await server.destroy();
  });

  describe('GET /', () => {
    it('should error when not logged in', async () => {
      const res = await server.exec.get('/api/users')
      expect(res.status).toBe(401)
    })

    it('should return specific fields for the logged-in user', async () => {
      const user = await User.create({
        discord_user_id: randNumber().toString(),
        email: randEmail(),
      })

      server.login(user)

      const res = await server.exec.get('/api/users')
      expect(res.status).toBe(200)
      expect(res.body).toEqual({
        id: user.id,
        discord_user_id: user.discord_user_id,
      })
    })
  })
});
