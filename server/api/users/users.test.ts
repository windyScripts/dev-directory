import { User } from 'server/models';
import TestServer from 'server/test/server';
import { createUser, getExpectedUserObject } from 'server/test/utils';
import { UserProfile } from 'server/types/User';

describe('auth router', () => {
  let server: TestServer;

  beforeAll(async () => {
    server = new TestServer();
    await server.init();
  });

  afterEach(async () => {
    User.destroy({
      where: {},
      truncate: true,
    });
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
      expect(res.body).toEqual(getExpectedUserObject(user));
    });
  });

  describe('GET /api/users', () => {
    it('should have an API endpoint that exists', async () => {
      const res = await server.exec.get('/api/users/');

      expect(res.status).toBe(200);
    });

    it('should return empty array if no users exist', async () => {
      const res = await server.exec.get('/api/users/');

      expect(res.body.users).toStrictEqual([]);
    });

    it('should return invalid page number with negative pages', async () => {
      const res = await server.exec.get('/api/users/?page=-1');

      expect(res.body.message).toEqual('Invalid page number');
      expect(res.status).toBe(400);
    });

    it('should return invalid page numer with non-numerical pages', async () => {
      const res = await server.exec.get('/api/users/?page=a');

      expect(res.body.message).toEqual('Invalid page number');
      expect(res.status).toBe(400);
    });

    it('should return page out of range with page that exceeds total pages', async () => {
      const res = await server.exec.get('/api/users/?page=9001');

      expect(res.body.message).toEqual('Page out of range');
      expect(res.status).toBe(400);
    });

    it('should return proper page metadata with the first page and no users', async () => {
      const res = await server.exec.get('/api/users/');

      expect(res.body.page).toEqual(1);
      expect(res.body.totalPages).toEqual(1);
    });

    it('should return proper page metadata with the first page and 20 users', async () => {
      const count = 20;
      await Promise.all(Array.from({ length: count }, createUser));

      const res = await server.exec.get('/api/users/');

      expect(res.body.page).toEqual(1);
      expect(res.body.totalPages).toEqual(1);
    });

    it('should return proper page metadata with the first page and 21 users', async () => {
      const count = 21;
      await Promise.all(Array.from({ length: count }, createUser));

      const res = await server.exec.get('/api/users/');

      expect(res.body.page).toEqual(1);
      expect(res.body.totalPages).toEqual(2);
    });

    it('should return proper page metadata with the second page', async () => {
      const count = 25;
      await Promise.all(Array.from({ length: count }, createUser));

      const res = await server.exec.get('/api/users?page=2');

      expect(res.body.page).toEqual(2);
      expect(res.body.totalPages).toEqual(2);
    });

    it('should return 20 users on first page', async () => {
      const count = 25;
      await Promise.all(Array.from({ length: count }, createUser));

      const res = await server.exec.get('/api/users/');

      expect(res.body.users.length).toEqual(20);
      expect(res.body.page).toEqual(1);
      expect(res.body.totalPages).toEqual(2);
    });

    it('should return 5 users on second page', async () => {
      const count = 25;
      await Promise.all(Array.from({ length: count }, createUser));

      const res = await server.exec.get('/api/users?page=2');

      expect(res.body.users.length).toEqual(5);
    });

    it('should return users sorted by user.id', async () => {
      const count = 5;
      const users: User[] = await Promise.all(Array.from({ length: count }, createUser));
      const userIds = users.map(user => user.id).sort((a, b) => a-b);

      const res = await server.exec.get('/api/users');
      const ids = res.body.users.map((user:UserProfile) => user.id);

      expect(ids).toEqual(userIds);
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
