import { AsyncRouter } from 'express-async-router';

import sampleRouter from './sample';

const apiRouter = AsyncRouter();

apiRouter.use('/sample', sampleRouter);

export default apiRouter;
