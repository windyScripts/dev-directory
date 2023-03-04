import { Sequelize } from 'sequelize';
import log from './log';

const dbString = process.env.DB_STRING

// Database object modeling mongoDB data
export class Database {
  dbName: string;
  sequelize = new Sequelize(dbString)

  constructor(dbName = 'postgres') {
    this.dbName = dbName;
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
