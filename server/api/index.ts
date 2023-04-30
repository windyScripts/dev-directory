import { cleanEnv } from 'envalid';
import { AsyncRouter } from 'express-async-router';

import authRouter from './auth';
import userRouter from './users';

const apiRouter = AsyncRouter();

const env = cleanEnv(process.env, {});

apiRouter.use('/users', userRouter);
apiRouter.use('/auth', authRouter);

if (env.isDev || env.isTest) {
  const devRouter = require('./dev').default; // eslint-disable-line @typescript-eslint/no-var-requires
  // These should NEVER be loaded in production.
  apiRouter.use('/dev', devRouter);
}

export default apiRouter;
