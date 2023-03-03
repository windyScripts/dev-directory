
import log from './log';

// Database object modeling mongoDB data
export class Database {
  dbName: string;

  constructor(dbName = 'postgres') {
    this.dbName = dbName;
  }

  // Connect to the mongoDB server
  async connect() {
    // connnect
    log('Connected to MongoDB! :)');
  }
}

const Db = new Database();

export default Db;
