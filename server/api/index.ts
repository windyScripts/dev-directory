import { AsyncRouter } from 'express-async-router';

import authRouter from './auth';
import userRouter from './users';

const apiRouter = AsyncRouter();

apiRouter.use('/users', userRouter);
apiRouter.use('/auth', authRouter);

export default apiRouter;
