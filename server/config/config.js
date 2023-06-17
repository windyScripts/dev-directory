// eslint-disable-next-line @typescript-eslint/no-var-requires
const { cleanEnv, str } = require('envalid');
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv-flow').config();

const env = cleanEnv(process.env, {
  DB_PORT: str(),
  DB_USER: str(),
  DB_HOST: str(),
  DB_NAME: str(),
  DB_PASSWORD: str(),
  DATABASE_URL: str(),
});

const dialectOptions = env.isProd ? {
  ssl: {
    rejectUnauthorized: false,
  },
} : undefined;

const nonProductionCreds = {
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  host: env.DB_HOST,
  database: env.DB_NAME,
  port: env.DB_PORT,
  dialect: 'postgresql',
  dialectOptions,
};

const [username, password, host, port, database] = env.DATABASE_URL.split(/[/:@]/g).slice(3);

const productionCreds = {
  username,
  password,
  host,
  port,
  database,
  dialect: 'postgresql',
  dialectOptions,
};

module.exports = {
  development: nonProductionCreds,
  test: nonProductionCreds,
  production: productionCreds,
};
