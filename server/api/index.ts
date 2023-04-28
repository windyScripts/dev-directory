import { cleanEnv } from 'envalid';
import { AsyncRouter } from 'express-async-router';

import devRouter from 'server/api/dev';

import authRouter from './auth';
import userRouter from './users';

const apiRouter = AsyncRouter();

const env = cleanEnv(process.env, {});

apiRouter.use('/users', userRouter);
apiRouter.use('/auth', authRouter);

if (!env.isProd) {
  // These should NEVER be loaded in production.
  apiRouter.use('/dev', devRouter);
}

export default apiRouter;
