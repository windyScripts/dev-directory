import jwt from 'jsonwebtoken';
import setCookie, { Cookie } from 'set-cookie-parser';
import { randEmail } from '@ngneat/falso';
import TestServer from 'server/test/server';
import * as authLib from 'server/lib/auth';
import { AUTH_COOKIE_NAME } from 'shared/constants';
import OAuth from 'discord-oauth2';
import { cleanEnv, str } from 'envalid';
import { User } from 'server/models';

const env = cleanEnv(process.env, {
  DISCORD_GUILD_ID: str()
})

function mockDiscord(user: Partial<OAuth.User>, isValid = false ) {
  return jest.spyOn(authLib, 'getDiscordUserAndGuilds').mockResolvedValueOnce({
    user: user as OAuth.User,
    guilds: [
      { id: isValid ? env.DISCORD_GUILD_ID : '12345' } as OAuth.PartialGuild
    ]
  });
}

describe('auth router', () => {
  let server: TestServer;

  beforeAll(async () => {
    server = new TestServer();
    await server.init();
  });

  afterAll(async () => {
    await server.destroy();
  });

  describe('POST /login', () => {
    it('should error if no code was provided', async () => {
      const res = await server.exec.post('/api/auth/login')
        .send({ code: '' });
      expect(res.status).toBe(400);
    });

    it('should create a user, sign a token, and set a cookie', async () => {
      const id = String(Math.random())

      const getInfoSpy = mockDiscord({
        id,
        email: randEmail(),
      })

      const code = 'some_valid_code';
      const res = await server.exec.post('/api/auth/login')
        .send({ code });

      expect(res.status).toBe(200);

      // ensure the function was called with the code that we sent
      expect(getInfoSpy.mock.calls[0][0] === code);

      const cookies: Cookie[] = res.headers['set-cookie']
        .map(setCookie.parse)
        .map((arr: Cookie[]) => arr[0]);
      const cookie = cookies.find(cookie => cookie.name === AUTH_COOKIE_NAME);

      const cookiePayload = jwt.decode(cookie.value);

      const createdUser = await User.findOne({ where: { discord_user_id: id }})

      // the cookie payload will contain extra things, so we just
      // want to make sure that it contains the same fields as user
      // using expect.objectContaining
      expect(cookiePayload).toEqual(expect.objectContaining({ id: createdUser.id }));
    });

    it('should not re-create a user, but update their email if it has changed', async () => {
      const id = String(Math.random())
      const oldEmail = randEmail()
      const newEmail = randEmail()

      await User.create({
        discord_user_id: id,
        email: oldEmail,
      })

      mockDiscord({
        id,
        email: newEmail,
      })

      const res = await server.exec.post('/api/auth/login')
        .send({ code: 'some_valid_code' });

      expect(res.status).toBe(200);

      const userWithOldEmail = await User.findOne({ where: { email: oldEmail }})
      const userWithNewEmail = await User.findOne({ where: { email: newEmail }})
      expect(userWithOldEmail).toBe(null)
      expect(userWithNewEmail.discord_user_id).toBe(id)
    });
  });
});
