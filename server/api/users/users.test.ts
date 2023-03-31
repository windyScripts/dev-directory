import { User } from 'server/models';
import TestServer from 'server/test/server';
import { createUser } from 'server/test/utils';

describe('auth router', () => {
  let server: TestServer;

  beforeAll(async () => {
    server = new TestServer();
    await server.init();
  });

  afterAll(async () => {
    await server.destroy();
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

  describe('PATCH /:id', () => {
    it('returns 403 if profile id is not equal to logged in user id', async () => {
      const user = await createUser();

      server.login(user);

      const res = await server.exec.patch('/api/users/54321');
      expect(res.status).toBe(403);
    });

    it('returns 400 if request body is empty', async () => {
      const user = await createUser();

      server.login(user);

      const res = await server.exec.patch(`/api/users/${user.id}`).send({});
      expect(res.status).toBe(400);
    });

    it('returns 400 if request body does not contain any updatable fields', async () => {
      const user = await createUser();

      server.login(user);

      const res = await server.exec.patch(`/api/users/${user.id}`).send({ asdf: 'asdf' });
      expect(res.status).toBe(400);
    });

    it('returns 404 if specified user doesn\'t exist in the database', async () => {
      const user = await createUser();

      server.login(user);

      await User.destroy({ where:{ id: user.id }});

      const res = await server.exec.patch(`/api/users/${user.id}`).send({ bio: 'test' });
      expect(res.status).toBe(404);
    });

    it('updates the specified user', async () => {
      const user = await createUser();

      server.login(user);

      const fieldsToUpdate = {
        bio: 'I was updated.',
        twitter_username: 'Updated@updated',
        linkedin_url: 'updated',
        github_username: 'gotUpdated',
        website: 'https://thiswasupdated.com/',
      };

      const res = await server.exec.patch(`/api/users/${user.id}`).send(fieldsToUpdate);
      expect(res.status).toBe(200);

      const updatedUser = await server.exec.get(`/api/users/${user.id}`);
      expect(updatedUser.status).toBe(200);
      expect(updatedUser.body).toEqual({
        id: user.id,
        discord_user_id: user.discord_user_id,
        discord_name: user.discord_name,
        bio: 'I was updated.',
        twitter_username: 'Updated@updated',
        linkedin_url: 'updated',
        github_username: 'gotUpdated',
        website: 'https://thiswasupdated.com/',
      });
    });
  });
});
