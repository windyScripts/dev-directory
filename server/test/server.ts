import { execSync } from 'child_process';

import 'server/lib/config-env';
import { cleanEnv, str } from 'envalid';
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
});

class TestServer extends Server {
  umzug: Umzug;
  loggedInUser: User | null = null;
  dbName: string;

  constructor(dbName: string = env.DB_NAME) {
    super();
    this.dbName = dbName;
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

    await this.createDb();
    await this.db.connect();
    await this.runMigrations();

    this.setMiddleware();
    this.setFakeAuth();
    this.setApiRoutes();
    this.setErrorHandlers();

    const port = await getPort();
    this.server = this.app.listen(port);
  }

  createDb() {
    return new Promise(resolve => {
      try {
        execSync(`docker-compose exec pg createdb -U ${env.DB_USER} ${this.dbName}`, { stdio: 'ignore' });
      } catch (err) {
        // this will fail if the db already exists, which will be all the time after the first time it's run
      }
      resolve(0);
    });
  }

  dropDb() {
    return new Promise(resolve => {
      try {
        execSync(`docker-compose exec pg createdb -U ${env.DB_USER} ${this.dbName}`, { stdio: 'ignore' });
      } catch (err) {
        // this will fail if the db already exists, which will be all the time after the first time it's run
      }
      resolve(0);
    });
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
    if (this.dbName) {
      await this.dropDb();
    }
    await this.db.sequelize.close();
    await this.server?.close();
  }
}

export default TestServer;
