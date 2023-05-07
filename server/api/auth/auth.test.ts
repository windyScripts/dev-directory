import { randEmail, randUserName } from '@ngneat/falso';
import DiscordOauth2 from 'discord-oauth2';
import { cleanEnv, str } from 'envalid';
import jwt from 'jsonwebtoken';
import setCookie, { Cookie } from 'set-cookie-parser';

import 'server/lib/config-env';
import * as authLib from 'server/lib/auth';
import { User } from 'server/models';
import TestServer from 'server/test/server';
import { createUser } from 'server/test/utils';
import { AUTH_COOKIE_NAME } from 'shared/constants';

const env = cleanEnv(process.env, {
  DISCORD_GUILD_ID: str(),
});

function mockDiscord(user: Partial<DiscordOauth2.User>, isValid = true) {
  return jest.spyOn(authLib, 'getDiscordUserAndGuilds').mockResolvedValueOnce({
    user: user as DiscordOauth2.User,
    guilds: [{ id: isValid ? env.DISCORD_GUILD_ID : '12345' } as DiscordOauth2.PartialGuild],
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
      const res = await server.exec.post('/api/auth/login').send({ code: '' });
      expect(res.status).toBe(400);
    });

    it('should create a user, sign a token, and set a cookie', async () => {
      const id = String(Math.random());

      const getInfoSpy = mockDiscord({
        id,
        email: randEmail(),
        username: randUserName(),
      });

      const code = 'some_valid_code';
      const res = await server.exec.post('/api/auth/login').send({ code });

      expect(res.status).toBe(200);

      // ensure the function was called with the code that we sent
      expect(getInfoSpy.mock.calls[0][0] === code);

      const cookies: Cookie[] = res.headers['set-cookie']
        .map(setCookie.parse)
        .map((arr: Cookie[]) => arr[0]);
      const cookie = cookies.find(cookie => cookie.name === AUTH_COOKIE_NAME);

      const cookiePayload = jwt.decode(cookie.value);

      const createdUser = await User.findOne({ where: { discord_user_id: id }});

      // the cookie payload will contain extra things, so we just
      // want to make sure that it contains the same fields as user
      // using expect.objectContaining
      expect(cookiePayload).toEqual(expect.objectContaining({ user_id: createdUser.id }));
    });

    it('should not re-create a user, but update their email if it has changed', async () => {
      const user = await createUser();

      const id = user.discord_user_id;
      const name = user.discord_name;
      const oldEmail = user.email;
      const newEmail = randEmail();

      mockDiscord({
        id,
        email: newEmail,
        username: name,
      });

      const res = await server.exec.post('/api/auth/login').send({ code: 'some_valid_code' });

      expect(res.status).toBe(200);

      const userWithOldEmail = await User.findOne({ where: { email: oldEmail }});
      const userWithNewEmail = await User.findOne({ where: { email: newEmail }});
      expect(userWithOldEmail).toBe(null);
      expect(userWithNewEmail.discord_user_id).toBe(id);
    });

    it('should error if the discord user is not a part of 100devs', async () => {
      mockDiscord(
        {
          id: String(Math.random()),
          email: randEmail(),
        },
        false,
      );

      const res = await server.exec.post('/api/auth/login').send({ code: 'some_valid_code' });

      expect(res.status).toBe(400);
    });
  });
});
