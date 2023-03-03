import TestServer from 'server/test/server';

describe('sample router', () => {
  let server: TestServer;

  beforeAll(async () => {
    server = new TestServer();
    await server.init();
  });

  afterAll(async () => {
    await server.destroy();
  });

  describe('sample route', () => {
    it('should return a response', async () => {
      const res = await server.exec.get('/api/sample/ping');
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('This is a test!');
    });
  });
});
