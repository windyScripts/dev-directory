import { User } from 'server/models';
import TestServer from 'server/test/server';
import { createUser, getExpectedUserObject } from 'server/test/utils';

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

  describe('GET /', () => {
    it('expects empty array if no users exist on the homepage', async () => {
      const res = await server.exec.get('/api/users/');
      expect(res.body.users).toStrictEqual([]);
    });

    it('expect invalid page request to return invalid page', async () => {
      const res = await server.exec.get('/api/users/?page=-1')
      expect(res.status).toBe(400)
      expect(res.body.error).toEqual('Invalid page number')
    })

    it('expect page request beyond page limit to be out of range', async () => {
      const res = await server.exec.get('/api/users/?page=100')
      expect(res.status).toBe(400)
      expect(res.body.error).toEqual('Page out of range')
    })

    it('returns first 20 users when it hits the homepage', async () => {

      const users: User[] = []; 

      for(let i = 0; i < 25; i++){
        const user = await createUser();
        users.push(user)
      }

      const limit = 20;
      const count = await User.count();
      const totalPages = Math.ceil(count / limit);

      const res = await server.exec.get('/api/users/');
      expect(res.status).toBe(200);
      expect(res.body.users.length).toEqual(limit)
      expect(res.body.users[0]).toEqual(getExpectedUserObject(users[0]));
      expect(res.body.users[19]).toEqual(getExpectedUserObject(users[19]));
      expect(res.body.page).toEqual(1)
      expect(res.body.totalPages).toEqual(totalPages)
    });

    it('returns first 20 users when it hits the homepage', async () => {

      const users: User[] = []; 

      for(let i = 0; i < 25; i++){
        const user = await createUser();
        users.push(user)
      }

      const limit = 20;
      const count = await User.count();
      const totalPages = Math.ceil(count / limit);

      const res = await server.exec.get('/api/users?page=2');

      expect(res.status).toBe(200);
      expect(res.body.users.length).toEqual(5)
      expect(res.body.users[0]).toEqual(getExpectedUserObject(users[20]));
      expect(res.body.users[4]).toEqual(getExpectedUserObject(users[24]));
      expect(res.body.page).toEqual(2)
      expect(res.body.totalPages).toEqual(totalPages)
    });
  })

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
