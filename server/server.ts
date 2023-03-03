import { Server as HttpServer } from 'http';
import { parse } from 'url';

import cookieParser from 'cookie-parser';
import express from 'express';
import { NextServer } from 'next/dist/server/next';

import apiRouter from './api';
import Db, { Database } from './lib/db';
import log from './lib/log';
import { prepareNextApp } from './lib/next';


// Express + Next Server object
class Server {
  app = express();
  port = Number(process.env.PORT) || 3000;
  nextApp: NextServer;
  db: Database;
  server: HttpServer;

  setMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  setApiRoutes() {
    this.app.use('/api', apiRouter);
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
