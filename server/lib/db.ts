import 'dotenv-flow/config';
import { cleanEnv, str, num, bool } from 'envalid';
import { Sequelize } from 'sequelize';

import log from './log';

const env = cleanEnv(process.env, {
  DATABASE_URL: str({
    desc: 'The connection URL for the PostgreSQL database',
  }),
  DB_LOGGING: bool({ default: false }),
});

const DATABASE_URL_Split = env.DATABASE_URL.split(/[:\/]+/);

const dialectOptions = env.isProd ? {
  ssl: {
    rejectUnauthorized: false,
  },
} : undefined;

// Database object modeling mongoDB data
export class Database {
  dbName: string;
  sequelize: Sequelize;
  
  constructor(database = DATABASE_URL_Split[4]) {
  
    this.dbName = database;

   this.sequelize = new Sequelize({
      port: parseInt(DATABASE_URL_Split[3]),
      username: DATABASE_URL_Split[1],
      password: DATABASE_URL_Split[2].split('@')[0],
      host: DATABASE_URL_Split[2].split('@')[1],
      database: database,
      dialectOptions,
      dialect: 'postgres',
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
