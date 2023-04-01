import { randEmail, randNumber, randUserName, randQuote, randUrl } from '@ngneat/falso';
import _ from 'lodash';

import { User } from 'server/models';
import { UserObject } from 'server/types/User';
import type { IntRange } from 'server/types/utils';

// random
// probability should only be 1 - 100
export function randomEmptyChance(probability: IntRange<0, 100>, preferredResult: string) {
  // out of a 100
  const randomNum = Math.random() * 100;
  return randomNum < probability ? '' : preferredResult;
}

function getRandomDiscriminator() {
  const range = { min: 0, max: 9999 };
  return `#${String(randNumber(range)).padStart(4, '0')}`;
}

function getRandomDiscordUserName() {
  return `${randUserName({})}${getRandomDiscriminator()}`;
}

function getRandomLinkedInURL() {
  return `https://www.linkedin.com/in/${randUserName()}/`;
}

function makeUnsavedUserModel({
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
    discord_name: discord_name ?? randomEmptyChance(20, getRandomDiscordUserName()),
    bio: bio ?? randomEmptyChance(20, randQuote()),
    twitter_username: twitter_username ?? randomEmptyChance(20, randUserName()),
    linkedin_url: linkedin_url ?? randomEmptyChance(20, getRandomLinkedInURL()),
    github_username: github_username ?? randomEmptyChance(20, randUserName()),
    website: website ?? randomEmptyChance(20, randUrl()),
  };
}

async function createSavedUserModel(options: Partial<UserObject> = {}) {
  const userObject = makeUnsavedUserModel(options);
  // insert into DB after creation
  return await User.create(userObject);
}

function createManyUsers(numberOfUsers: number): UserObject[] {
  return Array.from({ length: numberOfUsers }, makeUnsavedUserModel);
}

function getExpectedUserObject(user: User) {
  const allowedFields = User.allowedFields;
  const pickedUser = _.pick(user, allowedFields);
  return pickedUser as User;
}

export {
  makeUnsavedUserModel,
  createManyUsers,
  createSavedUserModel,
  getExpectedUserObject,
};
