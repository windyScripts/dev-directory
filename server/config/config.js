// eslint-disable-next-line @typescript-eslint/no-var-requires
const { cleanEnv, str } = require('envalid');
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv-flow').config();

const env = cleanEnv(process.env, {
  DATABASE_URL: str(),
  DB_HOST: str(),
  DB_NAME: str(),
  DB_USER: str(),
  DB_PASSWORD: str(),
  DB_PORT: str(),
});

const dialectOptions = env.isProd ? {
  ssl: {
    rejectUnauthorized: false,
  },
} : undefined;

const creds = {
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  host: env.DB_HOST,
  database: env.DB_NAME,
  port: env.DB_PORT,
  dialect: 'postgresql',
  dialectOptions,
};

module.exports = {
  development: creds,
  test: creds,
  production: creds,
};
