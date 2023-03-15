import { randEmail, randNumber, randUserName } from '@ngneat/falso';

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
      const res = await server.exec.get('/api/users');
      expect(res.status).toBe(401);
    });

    it('should return specific fields for the logged-in user', async () => {
      const user = await User.create({
        discord_user_id: randNumber().toString(),
        discord_name: randUserName(),
        email: randEmail(),
      });

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
      const user = await User.create({
        email: randEmail(),
        discord_user_id: randNumber().toString(),
        discord_name: `${randUserName()}#${randNumber()}`,
        bio: 'I like to put cat pictures on Caleb\'s desktop & my owner owns nerdwallet',
        twitter_username: randUserName(),
        linkedin_url: `https://www.linkedin.com/in/${randUserName()}/`,
        github_username: randUserName(),
        website: 'https://leonnoel.com/',
      });

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
