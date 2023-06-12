import 'server/lib/config-env';
import { cleanEnv, num, str } from 'envalid';
import { Client } from 'pg';
import { Sequelize } from 'sequelize-typescript';
import { SequelizeStorage, Umzug } from 'umzug';

import { Database } from 'server/lib/db';

const env = cleanEnv(process.env, {
  DB_NAME: str(),
  DB_USER: str(),
  DB_PASSWORD: str(),
  DB_PORT: num(),
  DB_HOST: str(),
});

async function testSetup() {
  console.log('recreating test db');
  const client = new Client({
    user: env.DB_USER,
    host: env.DB_HOST,
    password: env.DB_PASSWORD,
    port: env.DB_PORT,
  });
  await client.connect();
  await client.query(`DROP DATABASE IF EXISTS "${env.DB_NAME}"`);
  await client.query(`CREATE DATABASE "${env.DB_NAME}"`);
  await client.end();

  console.log('running migrations');
  const db = new Database();
  const umzug = new Umzug({
    migrations: {
      glob: ['../migrations/*.js', { cwd: __dirname }],
      // necessary, read: https://github.com/sequelize/umzug#modifying-the-parameters-passed-to-your-migration-methods
      resolve: ({ name, path, context }) => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const migration = require(path);
        return {
          name,
          up: async () => migration.up(context, Sequelize),
          down: async () => migration.down(context, Sequelize),
        };
      },
    },
    context: db.sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize: db.sequelize }),
    logger: undefined,
  });
  await umzug.up();
  console.log('completed test setup');
}

async function go() {
  try {
    await testSetup();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

go();
