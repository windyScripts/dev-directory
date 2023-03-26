import { User } from 'server/models';
import TestServer from 'server/test/server';
import { createUser, getExpectedUserObject } from 'server/test/utils';


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
      expect(res.body).toEqual(getExpectedUserObject(user));
      // Delete the user that was created
      await User.destroy({ where: {}});
    });
  });

  describe('GET /', () => {
    it('returns 404 if specified no users exist', async () => {
      const res = await server.exec.get('/api/users/');
      expect(res.status).toBe(404);
    });

    it('returns the specified user', async () => {
      const userOne = await createUser();
      const userTwo = await createUser();


      const res = await server.exec.get('/api/users/');
      expect(res.status).toBe(200);
      expect(res.body[0]).toEqual(getExpectedUserObject(userOne));
      expect(res.body[1]).toEqual(getExpectedUserObject(userTwo));
    });
  });
});
