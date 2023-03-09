import { AsyncRouter } from 'express-async-router';

import sampleRouter from './sample';
import authRouter from './auth';

const apiRouter = AsyncRouter();

apiRouter.use('/sample', sampleRouter);
apiRouter.use('/auth', authRouter);

export default apiRouter;
