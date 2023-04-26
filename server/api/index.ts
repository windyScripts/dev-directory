import { AsyncRouter } from 'express-async-router';

import authRouter from './auth';
import flagsRouter from './flags';
import userRouter from './users';

const apiRouter = AsyncRouter();

apiRouter.use('/users', userRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/flags', flagsRouter);

export default apiRouter;
