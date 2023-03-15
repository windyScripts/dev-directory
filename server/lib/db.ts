import 'dotenv-flow/config';
import { cleanEnv, str, num, bool } from 'envalid';
import { Sequelize } from 'sequelize';

import log from './log';

const env = cleanEnv(process.env, {
  DATABASE_URL: str(),
  DB_LOGGING: bool({ default: false }),
  DB_HOST: str(),
  DB_NAME: str(),
  DB_USER: str(),
  DB_PASSWORD: str(),
  DB_PORT: num(),
});

const dialectOptions = env.isProd ? {
  ssl: {
    rejectUnauthorized: false,
  },
} : undefined;

// Database object modeling mongoDB data
export class Database {
  dbName: string;
  sequelize: Sequelize;

  constructor(database= env.DB_NAME) {

    this.dbName = database;

    if( env.isProd ){
      this.sequelize = new Sequelize(env.DATABASE_URL,{
        dialectOptions,
        dialect: 'postgres',
        logging: env.DB_LOGGING,
      });
    }
    else{
      this.sequelize = new Sequelize({
        port: env.DB_PORT,
        username: env.DB_USER,
        password: env.DB_PASSWORD,
        host: env.DB_HOST,
        database: database,
        dialectOptions,
        dialect: 'postgres',
        logging: env.DB_LOGGING,
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
