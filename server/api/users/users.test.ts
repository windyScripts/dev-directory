import { User, Flag } from 'server/models';
import TestServer from 'server/test/server';
import { createUser, getExpectedUserObject, getExpectedFlagObject } from 'server/test/utils';
import { UserProfile } from 'server/types/User';

import { USERS_LIMIT } from './users.controller';

describe('user router', () => {
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
    it('should error with invalid page number when negative pages requested', async () => {
      const res = await server.exec.get('/api/users/?page=-1');

      expect(res.status).toBe(400);
      expect(res.body.message).toEqual('Invalid page number');
    });

    it('should error invalid page number when non-numerical pages requested', async () => {
      const res = await server.exec.get('/api/users/?page=a');

      expect(res.status).toBe(400);
      expect(res.body.message).toEqual('Invalid page number');
    });

    it('should error with page out of range when page exceeds total pages', async () => {
      const res = await server.exec.get('/api/users/?page=9001');

      expect(res.status).toBe(400);
      expect(res.body.message).toEqual('Page out of range');
    });

    it('should return empty array if no users exist', async () => {
      const res = await server.exec.get('/api/users/');

      expect(res.status).toBe(200);
      expect(res.body.users).toStrictEqual([]);
    });

    it('should return proper page metadata with the first page and no users', async () => {
      const res = await server.exec.get('/api/users/');

      expect(res.status).toBe(200);
      expect(res.body.page).toEqual(1);
      expect(res.body.totalPages).toEqual(1);
    });

    it('should return proper page metadata with the first page and 20 users', async () => {
      await Promise.all(Array.from({ length: 20 }, createUser));

      const res = await server.exec.get('/api/users/');

      expect(res.status).toBe(200);
      expect(res.body.page).toEqual(1);
      expect(res.body.totalPages).toEqual(1);
    });

    it('should return proper page metadata with the first page and 21 users', async () => {
      await Promise.all(Array.from({ length: 21 }, createUser));

      const res = await server.exec.get('/api/users/');

      expect(res.status).toBe(200);
      expect(res.body.page).toEqual(1);
      expect(res.body.totalPages).toEqual(2);
    });

    it('should return proper page metadata with the second page', async () => {
      await Promise.all(Array.from({ length: 25 }, createUser));

      const res = await server.exec.get('/api/users?page=2');

      expect(res.status).toBe(200);
      expect(res.body.page).toEqual(2);
      expect(res.body.totalPages).toEqual(2);
    });

    it(`should return ${USERS_LIMIT} users on first page`, async () => {
      await Promise.all(Array.from({ length: 25 }, createUser));

      const res = await server.exec.get('/api/users/');

      expect(res.status).toBe(200);
      expect(res.body.users.length).toEqual(USERS_LIMIT);
      expect(res.body.page).toEqual(1);
      expect(res.body.totalPages).toEqual(2);
    });

    it('should return 5 users on second page', async () => {
      await Promise.all(Array.from({ length: 25 }, createUser));

      const res = await server.exec.get('/api/users?page=2');

      expect(res.status).toBe(200);
      expect(res.body.users.length).toEqual(5);
    });

    it('should return users sorted by user.id', async () => {
      const users: User[] = await Promise.all(Array.from({ length: 5 }, createUser));
      const userIds = users.map(user => user.id).sort((a, b) => a - b);

      const res = await server.exec.get('/api/users');
      const ids = res.body.users.map((user: UserProfile) => user.id);

      expect(res.status).toBe(200);
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

      await User.destroy({ where: { id: user.id }});

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

  describe('Flag API', () => {
    describe('creating a flag', () => {
      let user: User;
      let flag: Flag;

      beforeEach(async () => {
        user = await createUser();
        const flagData = { user_id: user.id, flag_name: 'test' };
        flag = await Flag.create(flagData);
      });

      it('should create a new flag', async () => {
        expect(flag.id).toBeDefined();
        expect(flag.user_id).toBe(user.id);
        expect(flag.flag_name).toBe('test');
      });

      it('should return the created flag when queried', async () => {
        const queriedFlag = await Flag.findByPk(flag.id);
        const expectedFlag = getExpectedFlagObject(flag);
        expect(queriedFlag).toEqual(expectedFlag);
      });
    });
  });
});
