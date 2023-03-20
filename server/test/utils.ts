import { rand, randEmail, randNumber, randUserName, randQuote, randBrand } from '@ngneat/falso';

import { User } from 'server/models';

interface UserObject {
  email?: string;
  discord_user_id?: string;
  discord_name?: string;
  bio?: string;
  twitter_username?: string;
  linkedin_url?: string;
  github_username?: string;
  website?: string;
}

// https://stackoverflow.com/questions/39494689/is-it-possible-to-restrict-number-to-a-certain-range/39495173#39495173
// Tim's fault for telling me this is possible
type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>;

type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;

// random
// probability should only be 1 - 100
function randomEmptyChance(probability: IntRange<0, 100>, preferredResult: string) {
  // out of a 100
  const randomNum = Math.random() * 100;
  return randomNum < probability ? '' : preferredResult;
}

function randDiscordUserName() {
  return `${randUserName({})}#${String(
    randNumber({
      min: 0,
      max: 9999,
    }),
  ).padStart(4, '0')}`;
}

function randUserNameHandle() {
  return `@${randUserName({})}`;
}

function randLinkedInURL() {
  return `https://www.linkedin.com/in/${randUserName()}/`;
}

function randWebsite() {
  const scheme = rand(['https', 'http']);
  const wwwPart = rand(['www.', '']);
  const regex = new RegExp('[\\W]', 'g');
  const host = randBrand().replace(regex, '');
  const tld = rand(['com', 'gg', 'dev', 'org', 'net', 'me', 'io', 'us', 'info']);

  return `${scheme}://${wwwPart}${host}.${tld}`;
}

// await createUser({ discord_name: "poop#1234", bio: "i like poop" })
async function createUser({
  email,
  discord_user_id,
  discord_name,
  bio,
  twitter_username,
  linkedin_url,
  github_username,
  website,
}: UserObject = {}) {
  // build object
  // check which properties are included
  // 20% chance at empty values
  const userObject = {
    email: email ?? randomEmptyChance(20, randEmail()),
    discord_user_id:
      discord_user_id ?? randomEmptyChance(20, String(randNumber({ min: 1e16, max: 1e18 - 1 }))),
    discord_name: discord_name ?? randomEmptyChance(20, randDiscordUserName()),
    bio: bio ?? randomEmptyChance(20, randQuote()),
    twitter_username: twitter_username ?? randomEmptyChance(20, randUserNameHandle()),
    linkedin_url: linkedin_url ?? randomEmptyChance(20, randLinkedInURL()),
    github_username: github_username ?? randomEmptyChance(20, randUserNameHandle()),
    website: website ?? randomEmptyChance(20, randWebsite()),
  };

  // insert into DB after creation
  const user = await User.create(userObject);

  return user;
}

export default createUser;
