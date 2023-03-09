import { Server as HttpServer } from 'http';
import { parse } from 'url';
import { responseErrorHandler } from 'express-response-errors'
import cookieParser from 'cookie-parser';
import express from 'express';
import { NextServer } from 'next/dist/server/next';

import apiRouter from './api';
import Db, { Database } from './lib/db';
import log from './lib/log';
import { prepareNextApp } from './lib/next';
import { cleanEnv, num } from 'envalid';
import { attachUser } from './middleware/auth';

const env = cleanEnv(process.env, {
  PORT: num({ default: 3000 })
})

// Express + Next Server object
class Server {
  app = express();
  port = env.PORT;
  nextApp: NextServer;
  db: Database;
  server: HttpServer;

  setMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(attachUser)
  }

  setApiRoutes() {
    this.app.use('/api', apiRouter);
  }

  setErrorHandlers() {
    this.app.use(responseErrorHandler);
  }

  setNextRoutes() {
    const nextHandler = this.nextApp.getRequestHandler();
    this.app.get('*', (req, res) => {
      nextHandler(req, res, parse(req.url, true));
    });
  }

  async init() {
    this.db = Db;
    const results = await Promise.all([ // Wait for everything in promise to be done
      prepareNextApp(),
      this.db.connect(),
    ]);
    this.nextApp = results[0];

    this.setMiddleware();
    this.setApiRoutes();
    this.setNextRoutes();
    this.setErrorHandlers();
  }

  start() {
    return new Promise<void>(resolve => {
      this.server = this.app.listen(this.port, () => {
        log(`Server started on port ${this.port}`);
        resolve();
      });
    });
  }
}

export default Server;
