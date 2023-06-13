import { randEmail, randNumber, randUserName, randQuote, randUrl } from '@ngneat/falso';
import _ from 'lodash';

import Db from 'server/lib/db';
import { User } from 'server/models';
import { UserObject } from 'server/types/User';
import type { IntRange } from 'server/types/utils';

// random
// probability should only be 1 - 100
function randomEmptyChance(probability: IntRange<0, 100>, preferredResult: string) {
  // out of a 100
  const randomNum = Math.random() * 100;
  return randomNum < probability ? '' : preferredResult;
}

function getRandomDiscriminator() {
  const range = { min: 0, max: 9999 };
  return `#${String(randNumber(range)).padStart(4, '0')}`;
}

function getRandomDiscordUserName() {
  const username = randUserName();
  const discriminator = getRandomDiscriminator();
  const useDiscriminator = Math.random() < 0.5;

  return useDiscriminator ? `${username}${discriminator}` : username;
}

function getRandomLinkedInURL() {
  return `https://www.linkedin.com/in/${randUserName()}/`;
}

function makeUserObject({
  email,
  discord_user_id,
  discord_name,
  bio,
  twitter_username,
  linkedin_url,
  github_username,
  website,
}: Partial<UserObject> = {}) {
  // build object
  // check which properties are included
  // 20% chance at empty values
  return {
    email: email ?? randEmail(),
    discord_user_id: discord_user_id ?? String(randNumber({ min: 1e16, max: 1e18 - 1 })),
    discord_name: discord_name ?? getRandomDiscordUserName(),
    bio: bio ?? randomEmptyChance(20, randQuote()),
    twitter_username: twitter_username ?? randomEmptyChance(20, randUserName()),
    linkedin_url: linkedin_url ?? randomEmptyChance(20, getRandomLinkedInURL()),
    github_username: github_username ?? randomEmptyChance(20, randUserName()),
    website: website ?? randomEmptyChance(20, randUrl()),
  };
}

async function createUser(options: Partial<UserObject> = {}) {
  const userObject = makeUserObject(options);
  // insert into DB after creation
  return await User.create(userObject);
}

async function createUsers(numberOfUsers: number): Promise<User[]> {
  const userArray = Array.from({ length: numberOfUsers }, makeUserObject);
  return await Db.sequelize.transaction(async transaction => {
    return await User.bulkCreate(userArray, { transaction });
  });
}

function getExpectedUserObject(user: User) {
  const allowedFields = User.allowedFields;
  const pickedUser = _.pick(user, allowedFields);
  return pickedUser as User;
}

async function truncateDatabase() {
  for (const model in Db.sequelize.models) {
    if (model === 'SequelizeMeta') continue;
    await Db.sequelize.models[model].destroy({ truncate: true, restartIdentity: true });
  }
}

export {
  createUser,
  createUsers,
  getExpectedUserObject,
  makeUserObject,
  randomEmptyChance,
  truncateDatabase,
};
