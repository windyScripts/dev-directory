import { config } from 'dotenv-flow';
import { cleanEnv, str, num, bool } from 'envalid';
import { Sequelize, Dialect  } from 'sequelize';

import log from './log';

config({ silent: true });

const env = cleanEnv(process.env, {
  DB_HOST: str(),
  DB_NAME: str(),
  DB_USER: str(),
  DB_PASSWORD: str(),
  DB_PORT: num(),
  DB_LOGGING: bool({ default: false }),
  DATABASE_URL: str(),
});

const dialectOptions = env.isProd ? {
  ssl: {
    rejectUnauthorized: false,
  },
} : undefined;

const commonOptions = {
  dialect: 'postgres' as Dialect,
  logging: env.DB_LOGGING,
};

// Database object modeling mongoDB data
export class Database {
  dbName: string;
  sequelize: Sequelize;

  constructor(database = env.DB_NAME) {
    this.dbName = database;

    if (env.isProd) {
      this.sequelize = new Sequelize(env.DATABASE_URL, {
        dialectOptions,
        ...commonOptions,
      });
    } else {
      this.sequelize = new Sequelize({
        port: env.DB_PORT,
        username: env.DB_USER,
        password: env.DB_PASSWORD,
        host: env.DB_HOST,
        database: database,
        ...commonOptions,
      });
    }
  }

  // Connect to the postgres db
  async connect() {
    // connnect
    await this.sequelize.authenticate();
    log('Connected to db! :)');
  }
}

const Db = new Database();

export default Db;
