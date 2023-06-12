import 'server/lib/config-env';
import { cleanEnv, num, str } from 'envalid';
import { Client } from 'pg';
import { getPortPromise as getPort } from 'portfinder';
import { Sequelize } from 'sequelize-typescript';
import supertest from 'supertest';
import { Umzug, SequelizeStorage } from 'umzug';

import { Database } from 'server/lib/db';
import { User } from 'server/models';
import Server from 'server/server';

const env = cleanEnv(process.env, {
  DB_NAME: str(),
  DB_USER: str(),
  DB_PASSWORD: str(),
  DB_PORT: num(),
  DB_HOST: str(),
});

class TestServer extends Server {
  umzug: Umzug;
  loggedInUser: User | null = null;
  dbName: string;

  constructor(dbName: string = env.DB_NAME) {
    super();
    this.dbName = dbName;
  }

  get isCustomDb() {
    return this.dbName !== env.DB_NAME;
  }

  async init() {
    this.db = new Database(this.dbName);
    this.umzug = new Umzug({
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
      context: this.db.sequelize.getQueryInterface(),
      storage: new SequelizeStorage({ sequelize: this.db.sequelize }),
      logger: undefined,
    });

    if (this.isCustomDb) {
      await this.createDb();
    }
    await this.db.connect();
    if (this.isCustomDb) {
      await this.runMigrations();
    }

    this.setMiddleware();
    this.setFakeAuth();
    this.setApiRoutes();
    this.setErrorHandlers();

    const port = await getPort();
    this.server = this.app.listen(port);
  }

  async runDbCommands(commands: string[]) {
    const client = new Client({
      user: env.DB_USER,
      host: env.DB_HOST,
      password: env.DB_PASSWORD,
      port: env.DB_PORT,
    });
    await client.connect();
    for (const command of commands) {
      await client.query(command);
    }
    await client.end();
  }

  async createDb() {
    await this.runDbCommands([
      `DROP DATABASE IF EXISTS ${this.dbName}`,
      `CREATE DATABASE ${this.dbName}`,
    ]);
  }

  async dropDb() {
    await this.runDbCommands([`DROP DATABASE IF EXISTS "${this.dbName}";`]);
  }

  async runMigrations() {
    await this.umzug.up();
  }

  get exec() {
    return supertest(this.app);
  }

  setFakeAuth() {
    this.app.use((req, res, next) => {
      if (this.loggedInUser) {
        req.user = this.loggedInUser;
      }
      next();
    });
  }

  login(user: User) {
    this.loggedInUser = user;
  }

  logout() {
    this.loggedInUser = null;
  }

  async destroy() {
    await this.db.sequelize.close();
    await this.server?.close();
    if (this.isCustomDb) {
      await this.dropDb();
    }
  }
}

export default TestServer;
