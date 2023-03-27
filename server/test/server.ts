import 'dotenv-flow/config';
import { execSync } from 'child_process';

import { cleanEnv, str } from 'envalid';
import { getPortPromise as getPort } from 'portfinder';
import { Sequelize } from 'sequelize';
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

  async init() {
    this.db = new Database(env.DB_NAME);
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

    this.createDb();

    await this.db.connect();
    await this.revertMigrations();
    await this.runMigrations();

    this.setMiddleware();
    this.setFakeAuth();
    this.setApiRoutes();
    this.setErrorHandlers();

    const port = await getPort();
    this.server = this.app.listen(port);
  }

  createDb() {
    try {
      execSync(`docker-compose exec pg createdb -U ${env.DB_USER} ${env.DB_NAME}`, { stdio: 'ignore' });
    } catch (err) {
      // this will fail if the db already exists, which will be all the time after the first time it's run
    }
  }

  async runMigrations() {
    await this.umzug.up();
  }

  async revertMigrations() {
    await this.umzug.down({ to: 0 as const });
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
    await this.revertMigrations();
    await this.db.sequelize.close();
    if (this.server) {
      return new Promise<void>((resolve) => {
        this.server.close(() => resolve());
      });
    }
  }
}

export default TestServer;
