import { updateOrAddInEnvString } from 'server/lib/env';

const fileWithKeyNoValue = `# Secrets
AUTH_SECRET=

DB_PASSWORD=password

# Configuration Values
DISCORD_CLIENT_ID=bazbarfoobarbaz
`;

const fileWithExistingKeyValue = `# Secrets
AUTH_SECRET=bananas

DB_PASSWORD=password

# Configuration Values
DISCORD_CLIENT_ID=bazbarfoobarbaz
`;

const fileWithExistingKeyValueAndSpaces = `# Secrets
AUTH_SECRET = bananas

DB_PASSWORD=password

# Configuration Values
DISCORD_CLIENT_ID=bazbarfoobarbaz
`;

const fileWithNoKey = `# Secrets
DB_PASSWORD=password

# Configuration Values
DISCORD_CLIENT_ID=bazbarfoobarbaz
`;



const fileWithKeyOutput = `# Secrets
AUTH_SECRET=foobar

DB_PASSWORD=password

# Configuration Values
DISCORD_CLIENT_ID=bazbarfoobarbaz
`;

const fileWithNoKeyOutput = `# Secrets
DB_PASSWORD=password

# Configuration Values
DISCORD_CLIENT_ID=bazbarfoobarbaz

AUTH_SECRET=foobar
`;

describe('.env editor', () => {
  it('sets a value for already existing empty keys', async () => {
    const { newContents } = updateOrAddInEnvString(fileWithKeyNoValue, 'AUTH_SECRET', 'foobar');
    expect(newContents).toBe(fileWithKeyOutput);
  });

  it('overwrites existing key values', async () => {
    const { newContents } = updateOrAddInEnvString(fileWithExistingKeyValue, 'AUTH_SECRET', 'foobar');
    expect(newContents).toBe(fileWithKeyOutput);
  });

  it('overwrites existing key value, even when it contains spaces around the equal sign', async () => {
    const { newContents } = updateOrAddInEnvString(fileWithExistingKeyValueAndSpaces, 'AUTH_SECRET', 'foobar');
    expect(newContents).toBe(fileWithKeyOutput);
  });

  it('creates the key when it doesn\'t exist and sets the value', async () => {
    const { newContents } = updateOrAddInEnvString(fileWithNoKey, 'AUTH_SECRET', 'foobar');
    expect(newContents).toBe(fileWithNoKeyOutput);
  });
});
