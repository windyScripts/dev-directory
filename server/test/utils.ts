import { rand, randEmail, randNumber, randUserName, randQuote, randBrand } from '@ngneat/falso';

// user interface
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

// random
function randomEmptyChance(probability: number, preferredResult: number | string) {
  // out of a 100
  const randomNum = Math.random() * 100;
  return randomNum < probability ? '' : preferredResult;
}

// example

function randDiscordUserName() {
  return `${randUserName({})}#${String(
    randNumber({
      min: 0,
      max: 9999,
    })
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
  const host = randBrand().replace(regex);
  const tld = rand(['com', 'gg', 'dev', 'org', 'net', 'me', 'io', 'us', 'info']);

  return `${scheme}://${wwwPart}${host}.${tld}`;
}

// await createUser({ discord_name: "poop#1234", bio: "i like poop" })
function createUser({
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
  // check which properties are includes
  const userObject = {
    email: email ?? randomEmptyChance(20, randEmail()),
    discord_user_id:
      discord_user_id ?? randomEmptyChance(20, randNumber({ min: 1e16, max: 1e18 - 1 })),
    discord_name: discord_name ?? randomEmptyChance(20, randDiscordUserName()),
    bio: bio ?? randomEmptyChance(20, randQuote()),
    twitter_username: twitter_username ?? randomEmptyChance(20, randUserNameHandle()),
    linkedin_url: linkedin_url ?? randomEmptyChance(20, randLinkedInURL()),
    github_username: github_username ?? randomEmptyChance(20, randUserNameHandle()),
    website: website ?? randomEmptyChance(20, randWebsite()),
  };
  // 20% empty values
  // returns object

  return userObject;
}

// insert into the database
// returns the object after inserting into the database

console.log(createUser());
// console.log(createUser());

export default createUser;
