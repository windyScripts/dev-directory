import { AsyncRouter } from 'express-async-router';

import { sampleHandler } from './sample.controller';
const sampleRouter = AsyncRouter();

// sample router;
sampleRouter.get('/ping', sampleHandler);

export default sampleRouter;
