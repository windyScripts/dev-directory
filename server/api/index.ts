import { AsyncRouter } from 'express-async-router';

import userRouter from './users';
import authRouter from './auth';

const apiRouter = AsyncRouter();

apiRouter.use('/users', userRouter);
apiRouter.use('/auth', authRouter);

export default apiRouter;
