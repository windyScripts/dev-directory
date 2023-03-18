import TestServer from 'server/test/server';
import createUser from 'server/test/utils';

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
      const res = await server.exec.get('/api/users');
      expect(res.status).toBe(401);
    });

    it('should return specific fields for the logged-in user', async () => {
      const user = await createUser();

      server.login(user);

      const res = await server.exec.get('/api/users');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        id: user.id,
        discord_user_id: user.discord_user_id,
        discord_name: user.discord_name,
      });
    });
  });

  describe('GET /:id', () => {
    it('returns 404 if specified user doesn\'t exist', async () => {
      const res = await server.exec.get('/api/users/03402');
      expect(res.status).toBe(404);
    });

    it('returns the specified user', async () => {
      const user = await createUser();

      const res = await server.exec.get(`/api/users/${user.id}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        id: user.id,
        discord_user_id: user.discord_user_id,
        discord_name: user.discord_name,
        bio: user.bio,
        twitter_username: user.twitter_username,
        linkedin_url: user.linkedin_url,
        github_username: user.github_username,
        website: user.website,
      });
    });
  });
});
