import 'dotenv-flow/config';
import { cleanEnv, str, num, bool } from 'envalid';
import { Sequelize } from 'sequelize';

import log from './log';

const env = cleanEnv(process.env, {
  DB_HOST: str(),
  DB_NAME: str(),
  DB_USER: str(),
  DB_PASSWORD: str(),
  DB_PORT: num(),
  DB_LOGGING: bool({ default: false }),
});

// const dialectOptions = env.isProd ? {
//   ssl: {
//     rejectUnauthorized: false
//   },
// } : undefined

// Database object modeling mongoDB data
export class Database {
  dbName: string;
  sequelize: Sequelize;

  constructor(database = env.DB_NAME) {
    this.dbName = database;
    this.sequelize = new Sequelize({
      port: env.DB_PORT,
      username: env.DB_USER,
      password: env.DB_PASSWORD,
      host: env.DB_HOST,
      database: database,
      dialect: 'postgres',
      ssl: env.isProd,
      logging: env.DB_LOGGING,
    });
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
