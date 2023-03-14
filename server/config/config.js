// eslint-disable-next-line @typescript-eslint/no-var-requires
const { cleanEnv, str } = require('envalid');
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv-flow').config();

const env = cleanEnv(process.env, {
  DATABASE_URL: str({
    desc: 'The connection URL for the PostgreSQL database',
  }),
});

const DATABASE_URL_Split = env.DATABASE_URL.split(/[:\/]+/);
console.log(DATABASE_URL_Split);
const dialectOptions = env.isProd ? {
  ssl: {
    rejectUnauthorized: false,
  },
} : undefined;


const creds = {
  port: parseInt(DATABASE_URL_Split[3]),
  username: DATABASE_URL_Split[1],
  password: DATABASE_URL_Split[2].split('@')[0],
  host: DATABASE_URL_Split[2].split('@')[1],
  database: DATABASE_URL_Split[4],
  dialect: 'postgresql',
  dialectOptions,
};

module.exports = {
  development: creds,
  test: creds,
  production: creds,
};
